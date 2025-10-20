#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for Arabic dictionaries (Arramooz)
 * Input: nouns.ods, verbs.ods (OpenDocument Spreadsheet - actually HTML)
 * Output: Unified YAML format
 *
 * Note: The .ods files appear to be HTML documents based on file analysis.
 * This parser will need to be adapted based on actual file contents.
 */

import { stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";

interface DictEntry {
  word: string;
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
    format: string;
    license: string;
    note: string;
  };
  entries: DictEntry[];
}

async function main() {
  console.log("Note: Arabic dictionary files (nouns.ods, verbs.ods) appear to be HTML documents.");
  console.log("These files require special handling or may need to be re-downloaded.");
  console.log("Creating empty dictionary structure for now...");

  const dict: UnifiedDict = {
    metadata: {
      source: "Arramooz Arabic Dictionary",
      language: "ar",
      format: "ods",
      license: "GPL",
      note: "Files need to be processed - currently appear to be HTML instead of ODS",
    },
    entries: [],
  };

  console.log("Writing placeholder YAML output...");
  const yaml = stringifyYaml(dict);
  await Deno.writeTextFile("data/dict/arabic/dict.yaml", yaml);

  console.log("Done! Placeholder written to data/dict/arabic/dict.yaml");
  console.log("TODO: Download proper ODS files or parse HTML content");
}

if (import.meta.main) {
  main();
}
