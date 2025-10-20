#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for Spanish dictionaries
 * Input: spanish-dict.csv (JSON array) and spa-eng.tei (TEI XML)
 * Output: Unified YAML format
 */

import { parse as parseYaml, stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";
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
    target_language?: string;
    format: string;
    license: string;
  };
  entries: DictEntry[];
}

async function parseSpanishWordList(inputPath: string): Promise<DictEntry[]> {
  const text = await Deno.readTextFile(inputPath);
  const words = JSON.parse(text) as string[];

  return words.map((word) => ({
    word,
    translations: [],
  }));
}

async function parseSpanishTei(inputPath: string): Promise<UnifiedDict> {
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

  return {
    metadata: {
      source: "FreeDict Spanish-English",
      language: "es",
      target_language: "en",
      format: "tei",
      license: "GPL",
    },
    entries,
  };
}

async function mergeDictionaries(
  teiDict: UnifiedDict,
  wordList: DictEntry[]
): Promise<UnifiedDict> {
  // Create a map of existing words from TEI
  const wordMap = new Map<string, DictEntry>();
  for (const entry of teiDict.entries) {
    wordMap.set(entry.word.toLowerCase(), entry);
  }

  // Add words from word list that aren't in TEI
  for (const entry of wordList) {
    const key = entry.word.toLowerCase();
    if (!wordMap.has(key)) {
      wordMap.set(key, entry);
    }
  }

  return {
    metadata: {
      source: "FreeDict Spanish-English + Spanish Word List",
      language: "es",
      target_language: "en",
      format: "merged",
      license: "GPL + MIT",
    },
    entries: Array.from(wordMap.values()),
  };
}

async function main() {
  console.log("Parsing Spanish TEI dictionary...");
  const teiDict = await parseSpanishTei("data/dict/spanish/raw/spa-eng.tei");
  console.log(`Parsed ${teiDict.entries.length} entries from TEI`);

  console.log("Parsing Spanish word list...");
  const wordList = await parseSpanishWordList("data/dict/spanish/raw/spanish-dict.csv");
  console.log(`Parsed ${wordList.length} words from word list`);

  console.log("Merging dictionaries...");
  const mergedDict = await mergeDictionaries(teiDict, wordList);
  console.log(`Total entries: ${mergedDict.entries.length}`);

  console.log("Writing YAML output...");
  const yaml = stringifyYaml(mergedDict);
  await Deno.writeTextFile("data/dict/spanish/dict.yaml", yaml);

  console.log("Done! Output written to data/dict/spanish/dict.yaml");
}

if (import.meta.main) {
  main();
}
