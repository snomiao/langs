#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for FreeDict French-English dictionary
 * Input: TEI XML format
 * Output: Unified YAML format
 */

import { stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";

interface DictEntry {
  word: string;
  pronunciation?: string;
  pos?: string;
  gender?: string;
  translations: Array<{
    lang: string;
    text: string;
  }>;
}

interface UnifiedDict {
  metadata: {
    source: string;
    language: string;
    target_language: string;
    format: string;
    license: string;
    entry_count?: number;
  };
  entries: DictEntry[];
}

async function parseFrenchTei(inputPath: string): Promise<UnifiedDict> {
  const text = await Deno.readTextFile(inputPath);
  const doc = new DOMParser().parseFromString(text, "text/xml");

  if (!doc) {
    throw new Error("Failed to parse XML");
  }

  const entries: DictEntry[] = [];

  const entryNodes = doc.querySelectorAll("entry");
  for (const entryNode of entryNodes) {
    const orthNode = entryNode.querySelector("orth");
    const pronNode = entryNode.querySelector("pron");
    const posNode = entryNode.querySelector("pos");
    const genNode = entryNode.querySelector("gen");
    const senseNodes = entryNode.querySelectorAll("sense");

    if (!orthNode) continue;

    const word = orthNode.textContent?.trim() || "";
    const pronunciation = pronNode?.textContent?.trim();
    const pos = posNode?.textContent?.trim();
    const gender = genNode?.textContent?.trim();

    const translations: Array<{ lang: string; text: string }> = [];
    for (const senseNode of senseNodes) {
      const quoteNodes = senseNode.querySelectorAll('cit[type="trans"] quote');
      for (const quoteNode of quoteNodes) {
        const text = quoteNode.textContent?.trim();
        if (text) {
          translations.push({ lang: "en", text });
        }
      }
    }

    const entry: DictEntry = {
      word,
      pronunciation,
      pos,
      gender,
      translations,
    };

    entries.push(entry);
  }

  // Extract metadata from XML header
  const extentNode = doc.querySelector("extent");
  const entry_count = extentNode?.textContent?.match(/\d+/)?.[0];

  return {
    metadata: {
      source: "FreeDict French-English",
      language: "fr",
      target_language: "en",
      format: "tei",
      license: "GPL",
      entry_count: entry_count ? parseInt(entry_count) : undefined,
    },
    entries,
  };
}

async function main() {
  const inputPath = "data/dict/french/raw/freedict-fra-eng.txt";
  const outputPath = "data/dict/french/dict.yaml";

  console.log("Parsing FreeDict French-English dictionary...");
  const dict = await parseFrenchTei(inputPath);

  console.log(`Parsed ${dict.entries.length} entries`);
  console.log("Writing YAML output...");

  const yaml = stringifyYaml(dict);
  await Deno.writeTextFile(outputPath, yaml);

  console.log(`Done! Output written to ${outputPath}`);
}

if (import.meta.main) {
  main();
}
