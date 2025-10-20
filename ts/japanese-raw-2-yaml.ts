#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for JMdict Japanese-Multilingual dictionary
 * Input: JMdict.gz (XML format)
 * Output: Unified YAML format
 */

import { stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { gunzip } from "https://deno.land/x/denoflate@1.2.1/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

interface DictEntry {
  word: string;
  kanji?: string[];
  readings: string[];
  pos?: string[];
  translations: Array<{
    lang: string;
    text: string;
  }>;
  metadata?: {
    frequency?: string[];
    entry_id?: string;
  };
}

interface UnifiedDict {
  metadata: {
    source: string;
    language: string;
    target_languages: string[];
    format: string;
    license: string;
  };
  entries: DictEntry[];
}

async function parseJMdict(inputPath: string): Promise<UnifiedDict> {
  console.log("Reading and decompressing JMdict...");
  const compressed = await Deno.readFile(inputPath);
  const decompressed = gunzip(compressed);
  const text = new TextDecoder().decode(decompressed);

  console.log("Parsing XML...");
  const doc = new DOMParser().parseFromString(text, "text/xml");

  if (!doc) {
    throw new Error("Failed to parse XML");
  }

  const entries: DictEntry[] = [];
  const entryNodes = doc.querySelectorAll("entry");

  console.log(`Processing ${entryNodes.length} entries...`);
  let processed = 0;

  for (const entryNode of entryNodes) {
    processed++;
    if (processed % 10000 === 0) {
      console.log(`Processed ${processed} entries...`);
    }

    // Get entry sequence number
    const entSeqNode = entryNode.querySelector("ent_seq");
    const entryId = entSeqNode?.textContent?.trim();

    // Get kanji elements
    const kEleNodes = entryNode.querySelectorAll("k_ele");
    const kanji: string[] = [];
    const frequency: string[] = [];

    for (const kEleNode of kEleNodes) {
      const kebNode = kEleNode.querySelector("keb");
      if (kebNode?.textContent) {
        kanji.push(kebNode.textContent.trim());
      }

      const kePriNodes = kEleNode.querySelectorAll("ke_pri");
      for (const kePriNode of kePriNodes) {
        const freq = kePriNode.textContent?.trim();
        if (freq) frequency.push(freq);
      }
    }

    // Get reading elements
    const rEleNodes = entryNode.querySelectorAll("r_ele");
    const readings: string[] = [];

    for (const rEleNode of rEleNodes) {
      const rebNode = rEleNode.querySelector("reb");
      if (rebNode?.textContent) {
        readings.push(rebNode.textContent.trim());
      }

      const rePriNodes = rEleNode.querySelectorAll("re_pri");
      for (const rePriNode of rePriNodes) {
        const freq = rePriNode.textContent?.trim();
        if (freq && !frequency.includes(freq)) {
          frequency.push(freq);
        }
      }
    }

    // Get senses
    const senseNodes = entryNode.querySelectorAll("sense");
    const translations: Array<{ lang: string; text: string }> = [];
    const posSet = new Set<string>();

    for (const senseNode of senseNodes) {
      // Get part of speech
      const posNodes = senseNode.querySelectorAll("pos");
      for (const posNode of posNodes) {
        const pos = posNode.textContent?.trim();
        if (pos) posSet.add(pos);
      }

      // Get glosses (translations)
      const glossNodes = senseNode.querySelectorAll("gloss");
      for (const glossNode of glossNodes) {
        const lang = glossNode.getAttribute("xml:lang") || "eng";
        const text = glossNode.textContent?.trim();
        if (text) {
          translations.push({
            lang: lang === "eng" ? "en" : lang,
            text,
          });
        }
      }
    }

    // Create entry (use first reading or kanji as headword)
    const word = readings[0] || kanji[0] || "";
    if (!word) continue;

    const entry: DictEntry = {
      word,
      kanji: kanji.length > 0 ? kanji : undefined,
      readings,
      pos: posSet.size > 0 ? Array.from(posSet) : undefined,
      translations,
      metadata: {
        entry_id: entryId,
        frequency: frequency.length > 0 ? frequency : undefined,
      },
    };

    entries.push(entry);
  }

  return {
    metadata: {
      source: "JMdict (EDRDG)",
      language: "ja",
      target_languages: ["en", "ger", "fre", "rus", "spa", "swe", "hun", "slv"],
      format: "xml",
      license: "CC BY-SA 4.0",
    },
    entries,
  };
}

async function main() {
  const inputPath = "data/dict/japanese/raw/JMdict.gz";
  const outputPath = "data/dict/japanese/dict.yaml";

  console.log("Parsing JMdict...");
  const dict = await parseJMdict(inputPath);

  console.log(`Parsed ${dict.entries.length} entries`);
  console.log("Writing YAML output...");

  const yaml = stringifyYaml(dict);
  await Deno.writeTextFile(outputPath, yaml);

  console.log(`Done! Output written to ${outputPath}`);
}

if (import.meta.main) {
  main();
}
