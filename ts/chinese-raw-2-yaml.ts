#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for CC-CEDICT Chinese-English dictionary
 * Input: cedict_ts.u8 format (gzipped)
 * Output: Unified YAML format
 */

import { parse as parseYaml, stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { gunzip } from "https://deno.land/x/denoflate@1.2.1/mod.ts";

interface DictEntry {
  word: string;
  traditional?: string;
  simplified?: string;
  pronunciation: string;
  pos?: string;
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
  };
  entries: DictEntry[];
}

async function parseCedict(inputPath: string): Promise<UnifiedDict> {
  // Read and decompress the file
  const compressed = await Deno.readFile(inputPath);
  const decompressed = gunzip(compressed);
  const text = new TextDecoder().decode(decompressed);
  const lines = text.split("\n");

  const entries: DictEntry[] = [];
  let metadata: any = {
    source: "CC-CEDICT",
    language: "zh",
    target_language: "en",
    format: "cedict",
    license: "CC BY-SA 4.0",
  };

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith("#") || line.trim() === "") {
      // Extract metadata from comments
      if (line.startsWith("#! version=")) {
        metadata.version = line.substring(11);
      } else if (line.startsWith("#! entries=")) {
        metadata.entry_count = parseInt(line.substring(11));
      } else if (line.startsWith("#! date=")) {
        metadata.date = line.substring(8);
      }
      continue;
    }

    // Parse entry line: Traditional Simplified [pinyin] /def1/def2/...
    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
    if (!match) continue;

    const [, traditional, simplified, pinyin, defsStr] = match;
    const definitions = defsStr.split("/").filter((d) => d.trim() !== "");

    const entry: DictEntry = {
      word: simplified,
      traditional: traditional !== simplified ? traditional : undefined,
      simplified: simplified,
      pronunciation: pinyin,
      translations: definitions.map((def) => ({
        lang: "en",
        text: def.trim(),
      })),
    };

    entries.push(entry);
  }

  return {
    metadata,
    entries,
  };
}

async function main() {
  const inputPath = "data/dict/chinese/raw/cedict_ts.u8.gz";
  const outputPath = "data/dict/chinese/dict.yaml";

  console.log("Parsing CC-CEDICT...");
  const dict = await parseCedict(inputPath);

  console.log(`Parsed ${dict.entries.length} entries`);
  console.log("Writing YAML output...");

  // Write YAML output
  const yaml = stringifyYaml(dict);
  await Deno.writeTextFile(outputPath, yaml);

  console.log(`Done! Output written to ${outputPath}`);
}

if (import.meta.main) {
  main();
}
