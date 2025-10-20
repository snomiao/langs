#!/usr/bin/env -S deno run --allow-read --allow-write --allow-run
/**
 * Main script to parse all dictionaries
 * Runs all language-specific parsers
 */

const parsers = [
  "chinese-raw-2-yaml.ts",
  "japanese-raw-2-yaml.ts",
  "french-raw-2-yaml.ts",
  "spanish-raw-2-yaml.ts",
  "russian-raw-2-yaml.ts",
  "english-raw-2-yaml.ts",
  "arabic-raw-2-yaml.ts",
];

console.log("=".repeat(60));
console.log("Dictionary Parser - Processing All Languages");
console.log("=".repeat(60));
console.log("");

for (const parser of parsers) {
  const lang = parser.replace("-raw-2-yaml.ts", "");
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Processing ${lang.toUpperCase()}`);
  console.log("=".repeat(60));

  try {
    const command = new Deno.Command("deno", {
      args: ["run", "--allow-read", "--allow-write", `ts/${parser}`],
      stdout: "inherit",
      stderr: "inherit",
    });

    const { code } = await command.output();

    if (code === 0) {
      console.log(`✓ ${lang} completed successfully`);
    } else {
      console.error(`✗ ${lang} failed with exit code ${code}`);
    }
  } catch (error) {
    console.error(`✗ ${lang} failed with error:`, error);
  }
}

console.log("\n" + "=".repeat(60));
console.log("All parsers completed!");
console.log("=".repeat(60));
