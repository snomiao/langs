import { chromium } from "playwright";
import path from "node:path";

interface WordData {
  rank: number;
  lForm: string; // written form
  lemma: string; // lemma/headword
  pos: string; // part of speech
  subLemma: string;
  wType: string; // word type (和/漢/外/混)
  frequency: number;
  pmw: number; // per million words
}

async function extractBCCWJData(): Promise<WordData[]> {
  const allWords: WordData[] = [];
  const startTime = Date.now();

  console.log("Extracting BCCWJ word frequency data...");
  console.log("Target: BCCWJ Short Unit Word list\n");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  try {
    // Navigate to the BCCWJ word list page
    console.log("Navigating to BCCWJ word list page...");
    await page.goto("https://clrd.ninjal.ac.jp/bccwj/en/freq-list.html", {
      waitUntil: "networkidle",
    });

    console.log("Page loaded successfully");

    // Click on the Short Unit Word list link
    console.log("Clicking on Short Unit Word list link...");
    const suwLink = page.locator('a[href="http://doi.org/10.15084/00003218"]');
    await suwLink.click();

    // Wait for navigation to DOI page
    await page.waitForLoadState("networkidle");
    console.log("Navigated to DOI repository page");

    // Take screenshot for debugging
    await page.screenshot({
      path: "bccwj-doi-page.png",
      fullPage: true,
    });
    console.log("Screenshot saved: bccwj-doi-page.png");

    // Look for download links on the page
    const downloadLinks = await page.locator('a[href*=".zip"], a[href*=".tsv"], a[href*=".txt"]').all();
    console.log(`Found ${downloadLinks.length} potential download links`);

    for (const link of downloadLinks) {
      const href = await link.getAttribute("href");
      const text = await link.textContent();
      console.log(`  - ${text?.trim()}: ${href}`);
    }

    // Get the actual file download URL
    // Looking for the direct download link (not the javascript one)
    const directLinks = await page.locator('a[href*=".zip"]').all();
    let zipUrl = "";

    for (const link of directLinks) {
      const href = await link.getAttribute("href");
      if (href && !href.startsWith("javascript:") && href.includes(".zip")) {
        zipUrl = href;
        break;
      }
    }

    if (!zipUrl) {
      throw new Error("Could not find ZIP download link");
    }

    // Make it an absolute URL if it's relative
    if (zipUrl.startsWith("/")) {
      const baseUrl = new URL(page.url()).origin;
      zipUrl = baseUrl + zipUrl;
    }

    console.log(`\nFound ZIP file URL: ${zipUrl}`);

    // Download the file using Bun's fetch
    console.log("Downloading file...");
    const response = await fetch(zipUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the ZIP file
    const zipPath = path.join("ja/bccwj", "BCCWJ_frequencylist_suw_ver1_0.zip");
    await Bun.write(zipPath, buffer);
    console.log(`ZIP file saved to: ${zipPath}`);

    // Extract the ZIP file
    console.log("Extracting ZIP file...");
    const extractDir = path.join("ja/bccwj", "extracted");
    await Bun.$`mkdir -p ${extractDir}`;
    await Bun.$`unzip -o ${zipPath} -d ${extractDir}`;
    console.log(`Files extracted to: ${extractDir}`);

    // List extracted files
    const extractedFiles = await Bun.$`ls -la ${extractDir}`.text();
    console.log("Extracted files:");
    console.log(extractedFiles);

    // Find and read TSV files
    const tsvFiles = await Bun.$`find ${extractDir} -name "*.tsv" -o -name "*.txt" -o -name "*.csv"`.text();
    console.log("\nFound data files:");
    console.log(tsvFiles);

    // Parse the first TSV file we find
    const tsvFileList = tsvFiles.trim().split("\n").filter(f => f);
    if (tsvFileList.length > 0) {
      const tsvFile = tsvFileList[0];
      console.log(`\nReading file: ${tsvFile}`);

      const fileContent = await Bun.file(tsvFile).text();
      const lines = fileContent.split("\n");

      console.log(`File has ${lines.length} lines`);
      console.log("First 5 lines:");
      console.log(lines.slice(0, 5).join("\n"));

      // Parse TSV data (skip header)
      // Columns: rank, lForm, lemma, pos, subLemma, wType, frequency, pmw, ...
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const fields = line.split("\t");
        if (fields.length >= 8) {
          allWords.push({
            rank: parseInt(fields[0]) || 0,
            lForm: fields[1] || "",
            lemma: fields[2] || "",
            pos: fields[3] || "",
            subLemma: fields[4] || "",
            wType: fields[5] || "",
            frequency: parseInt(fields[6]) || 0,
            pmw: parseFloat(fields[7]) || 0,
          });
        }
      }
    }

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 EXTRACTION COMPLETE!`);
    console.log(`   Total words extracted: ${allWords.length}`);
    console.log(`   Total time: ${totalTime.toFixed(1)} seconds`);

    // Save to JSON
    const outputPath = path.join("ja/bccwj", "bccwj_words.json");
    await Bun.write(outputPath, JSON.stringify(allWords, null, 2));
    console.log(`📁 JSON data saved to ${outputPath}`);

    // Save to CSV
    const csvPath = path.join("ja/bccwj", "bccwj_words.csv");
    const csvHeader = "Rank,lForm,Lemma,POS,SubLemma,WType,Frequency,PMW\n";
    const csvData = allWords
      .map(
        (word) =>
          `${word.rank},"${word.lForm}","${word.lemma}","${word.pos}","${word.subLemma}","${word.wType}",${word.frequency},${word.pmw}`,
      )
      .join("\n");

    await Bun.write(csvPath, csvHeader + csvData);
    console.log(`📁 CSV data saved to ${csvPath}`);

    return allWords;
  } catch (error) {
    console.error("Error during extraction:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the BCCWJ data extractor
if (import.meta.main) {
  extractBCCWJData()
    .then((words) => {
      console.log("\n✅ BCCWJ data extraction completed successfully!");
      console.log(`📊 Final count: ${words.length} words`);
      if (words.length > 0) {
        console.log("\n📝 Sample data:");
        console.log(words.slice(0, 5));
        console.log("...");
        console.log(words.slice(-5));
      }
    })
    .catch((error) => {
      console.error("❌ BCCWJ data extraction failed:", error);
      process.exit(1);
    });
}

export { extractBCCWJData };
