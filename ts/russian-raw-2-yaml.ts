#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Parser for Russian dictionaries
 * Input: russian-nouns.csv, words.csv (CSV format)
 * Output: Unified YAML format
 */

import { stringify as stringifyYaml } from "https://deno.land/std@0.224.0/yaml/mod.ts";
import { parse as parseCSV } from "https://deno.land/std@0.224.0/csv/parse.ts";

interface DictEntry {
  word: string;
  accented?: string;
  pronunciation?: string;
  pos?: string;
  gender?: string;
  translations: Array<{
    lang: string;
    text: string;
  }>;
  forms?: {
    singular?: Record<string, string>;
    plural?: Record<string, string>;
  };
  metadata?: {
    animate?: boolean;
    indeclinable?: boolean;
    sg_only?: boolean;
    pl_only?: boolean;
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

async function parseRussianNouns(inputPath: string): Promise<DictEntry[]> {
  const text = await Deno.readTextFile(inputPath);
  const rows = parseCSV(text, { skipFirstRow: true }) as any[];

  const entries: DictEntry[] = [];

  for (const row of rows) {
    const entry: DictEntry = {
      word: row.bare,
      accented: row.accented,
      pos: "noun",
      gender: row.gender || undefined,
      translations: [],
      forms: {
        singular: {},
        plural: {},
      },
      metadata: {
        animate: row.animate === "1",
        indeclinable: row.indeclinable === "1",
        sg_only: row.sg_only === "1",
        pl_only: row.pl_only === "1",
      },
    };

    // Add translations
    if (row.translations_en) {
      entry.translations.push({ lang: "en", text: row.translations_en });
    }
    if (row.translations_de) {
      entry.translations.push({ lang: "de", text: row.translations_de });
    }

    // Add declension forms
    if (entry.forms) {
      entry.forms.singular = {
        nominative: row.sg_nom || "",
        genitive: row.sg_gen || "",
        dative: row.sg_dat || "",
        accusative: row.sg_acc || "",
        instrumental: row.sg_inst || "",
        prepositional: row.sg_prep || "",
      };

      entry.forms.plural = {
        nominative: row.pl_nom || "",
        genitive: row.pl_gen || "",
        dative: row.pl_dat || "",
        accusative: row.pl_acc || "",
        instrumental: row.pl_inst || "",
        prepositional: row.pl_prep || "",
      };
    }

    entries.push(entry);
  }

  return entries;
}

async function main() {
  console.log("Parsing Russian nouns CSV...");
  const nounsPath = "data/dict/russian/raw/russian-nouns.csv";
  const entries = await parseRussianNouns(nounsPath);

  console.log(`Parsed ${entries.length} noun entries`);

  const dict: UnifiedDict = {
    metadata: {
      source: "OpenRussian.org",
      language: "ru",
      target_languages: ["en", "de"],
      format: "csv",
      license: "CC BY-SA",
    },
    entries,
  };

  console.log("Writing YAML output...");
  const yaml = stringifyYaml(dict);
  await Deno.writeTextFile("data/dict/russian/dict.yaml", yaml);

  console.log("Done! Output written to data/dict/russian/dict.yaml");
}

if (import.meta.main) {
  main();
}
