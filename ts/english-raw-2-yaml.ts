#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for Open English WordNet
 * Input: wordnet-2024.xml.gz (XML format)
 * Output: Unified YAML format
 */

import { stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { gunzip } from "https://deno.land/x/denoflate@1.2.1/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

interface DictEntry {
  word: string;
  pos?: string;
  translations: Array<{
    lang: string;
    text: string;
  }>;
  senses?: Array<{
    synset_id: string;
    relations?: Array<{
      type: string;
      target: string;
    }>;
  }>;
  metadata?: {
    entry_id: string;
  };
}

interface UnifiedDict {
  metadata: {
    source: string;
    language: string;
    format: string;
    license: string;
    version: string;
  };
  entries: DictEntry[];
}

async function parseWordNet(inputPath: string): Promise<UnifiedDict> {
  console.log("Reading and decompressing WordNet...");
  const compressed = await Deno.readFile(inputPath);
  const decompressed = gunzip(compressed);
  const text = new TextDecoder().decode(decompressed);

  console.log("Parsing XML...");
  const doc = new DOMParser().parseFromString(text, "text/xml");

  if (!doc) {
    throw new Error("Failed to parse XML");
  }

  const entries: DictEntry[] = [];
  const lexiconNode = doc.querySelector("Lexicon");
  const version = lexiconNode?.getAttribute("version") || "2024";

  const entryNodes = doc.querySelectorAll("LexicalEntry");
  console.log(`Processing ${entryNodes.length} entries...`);

  let processed = 0;
  for (const entryNode of entryNodes) {
    processed++;
    if (processed % 10000 === 0) {
      console.log(`Processed ${processed} entries...`);
    }

    const entryId = entryNode.getAttribute("id") || "";
    const lemmaNode = entryNode.querySelector("Lemma");

    if (!lemmaNode) continue;

    const word = lemmaNode.getAttribute("writtenForm") || "";
    const pos = lemmaNode.getAttribute("partOfSpeech") || "";

    // Get senses
    const senseNodes = entryNode.querySelectorAll("Sense");
    const senses: Array<{
      synset_id: string;
      relations?: Array<{ type: string; target: string }>;
    }> = [];

    for (const senseNode of senseNodes) {
      const senseId = senseNode.getAttribute("id") || "";
      const synsetId = senseNode.getAttribute("synset") || "";

      const relations: Array<{ type: string; target: string }> = [];
      const relNodes = senseNode.querySelectorAll("SenseRelation");

      for (const relNode of relNodes) {
        const relType = relNode.getAttribute("relType") || "";
        const target = relNode.getAttribute("target") || "";
        if (relType && target) {
          relations.push({ type: relType, target });
        }
      }

      senses.push({
        synset_id: synsetId,
        relations: relations.length > 0 ? relations : undefined,
      });
    }

    const entry: DictEntry = {
      word,
      pos,
      translations: [], // WordNet is monolingual
      senses: senses.length > 0 ? senses : undefined,
      metadata: {
        entry_id: entryId,
      },
    };

    entries.push(entry);
  }

  return {
    metadata: {
      source: "Open English WordNet",
      language: "en",
      format: "wordnet-xml",
      license: "Open Source",
      version,
    },
    entries,
  };
}

async function main() {
  const inputPath = "data/dict/english/raw/wordnet-2024.xml.gz";
  const outputPath = "data/dict/english/dict.yaml";

  console.log("Parsing Open English WordNet...");
  const dict = await parseWordNet(inputPath);

  console.log(`Parsed ${dict.entries.length} entries`);
  console.log("Writing YAML output...");

  const yaml = stringifyYaml(dict);
  await Deno.writeTextFile(outputPath, yaml);

  console.log(`Done! Output written to ${outputPath}`);
}

if (import.meta.main) {
  main();
}
