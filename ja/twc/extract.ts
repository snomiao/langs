import fs from "node:fs";
import path from "node:path";
import type { WordData, WordRow, ApiResponse } from "./types";

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  baseDelay = 1000,
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        if (response.status >= 500 || response.status === 429) {
          // Server errors and rate limiting - retry
          throw error;
        } else {
          // Client errors - don't retry
          throw error;
        }
      }

      return response;
    } catch (error) {
      const isNetworkError =
        error instanceof TypeError ||
        (error instanceof Error &&
          (error.message.includes("fetch") ||
            error.message.includes("network") ||
            error.message.includes("timeout") ||
            error.message.includes("ECONNRESET") ||
            error.message.includes("ENOTFOUND")));

      const isRetriableHttpError =
        error instanceof Error &&
        (error.message.includes("status: 5") ||
          error.message.includes("status: 429"));

      if ((isNetworkError || isRetriableHttpError) && attempt < maxRetries) {
        const delay = baseDelay * 2 ** (attempt - 1) + Math.random() * 1000;
        console.warn(
          `Attempt ${attempt} failed: ${error.message}. Retrying in ${Math.round(delay)}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts`);
}

async function extractTWCData(): Promise<WordData[]> {
  const allWords: WordData[] = [];
  const startTime = Date.now();
  let lastProgressUpdate = Date.now();

  try {
    console.log("Extracting ALL TWC data using direct AJAX calls...");
    console.log("Target: 1,006 pages (~100,553 words total)");
    console.log("This will take approximately 10-15 minutes...\n");

    // We'll scrape ALL 1,006 pages with ~100 words each = ~100,553 total
    for (let page = 1; page <= 1006; page++) {
      console.log(`Fetching page ${page}...`);

      const response = await fetchWithRetry(
        "https://tsukubawebcorpus.jp/headwordlist_all/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "en-US,en;q=0.5",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
            Referer: "https://tsukubawebcorpus.jp/search/en/",
          },
          body: new URLSearchParams({
            _search: "true",
            nd: Date.now().toString(),
            rows: "100",
            page: page.toString(),
            sidx: "freq",
            sord: "desc",
            totalrows: "100000",
          }),
        },
        5, // max retries
        2000, // base delay in ms
      );

      const responseText = await response.text();
      console.log(`Response for page ${page}:`, responseText.slice(0, 200));

      let data: ApiResponse;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`Failed to parse JSON for page ${page}:`, parseError);
        console.log("Raw response:", responseText);
        continue;
      }

      console.log(`Parsed data structure:`, {
        hasRows: !!data.rows,
        rowsLength: data.rows?.length,
        total: data.total,
        page: data.page,
        records: data.records,
      });

      if (data.rows && Array.isArray(data.rows)) {
        for (const row of data.rows) {
          // The data structure is an object, not an array
          if (
            row.headword &&
            row.yomi_display &&
            row.romaji_display &&
            row.freq
          ) {
            allWords.push({
              headword: row.headword.toString().trim(),
              reading: row.yomi_display.toString().trim(),
              romanizedSpelling: row.romaji_display.toString().trim(),
              freq: row.freq.toString(),
            });
          }
        }
      }

      // Progress monitoring and statistics
      const currentTime = Date.now();
      const elapsedMinutes = (currentTime - startTime) / 60000;
      const pagesPerMinute = page / elapsedMinutes;
      const wordsPerMinute = allWords.length / elapsedMinutes;
      const estimatedTotalMinutes = 1006 / pagesPerMinute;
      const estimatedTimeRemaining = estimatedTotalMinutes - elapsedMinutes;

      console.log(
        `✓ Page ${page}/1006 processed, total words: ${allWords.length}/~100553 (${((page / 1006) * 100).toFixed(1)}%)`,
      );

      // Show detailed progress every minute or every 50 pages
      if (currentTime - lastProgressUpdate >= 60000 || page % 50 === 0) {
        console.log(`\n📊 PROGRESS REPORT:`);
        console.log(
          `   Pages completed: ${page}/1006 (${((page / 1006) * 100).toFixed(1)}%)`,
        );
        console.log(
          `   Words extracted: ${allWords.length}/~100553 (${((page / 1006) * 100).toFixed(1)}%)`,
        );
        console.log(`   Time elapsed: ${elapsedMinutes.toFixed(1)} minutes`);
        console.log(
          `   Speed: ${pagesPerMinute.toFixed(1)} pages/min, ${wordsPerMinute.toFixed(0)} words/min`,
        );
        console.log(
          `   ETA: ${estimatedTimeRemaining.toFixed(1)} minutes remaining`,
        );
        console.log(
          `   Memory usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB\n`,
        );
        lastProgressUpdate = currentTime;
      }

      // Save intermediate results every 100 pages
      if (page % 100 === 0) {
        try {
          const intermediateJsonPath = `intermediate_${page}_pages.json`;
          const intermediateCsvPath = `intermediate_${page}_pages.csv`;

          fs.writeFileSync(
            intermediateJsonPath,
            JSON.stringify(allWords, null, 2),
          );

          const csvHeader = "Headword,Reading,Romanized spelling,Freq\n";
          const csvData = allWords
            .map(
              (word) =>
                `"${word.headword}","${word.reading}","${word.romanizedSpelling}","${word.freq}"`,
            )
            .join("\n");
          fs.writeFileSync(intermediateCsvPath, csvHeader + csvData);

          console.log(
            `💾 Intermediate backup saved: ${allWords.length} words to ${intermediateJsonPath}`,
          );
        } catch (backupError) {
          console.warn(`⚠️  Failed to save intermediate backup:`, backupError);
        }
      }

      // Add a small delay to be respectful - reduced delay for 100 pages
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const totalTime = (Date.now() - startTime) / 60000;
    console.log(`\n🎉 EXTRACTION COMPLETE!`);
    console.log(`   Total words extracted: ${allWords.length}`);
    console.log(`   Total time: ${totalTime.toFixed(1)} minutes`);
    console.log(
      `   Average speed: ${(allWords.length / totalTime).toFixed(0)} words/min`,
    );

    // Create directory if it doesn't exist
    const dir = path.join(".");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to JSON with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputPath = path.join(".", `twc_COMPLETE_${timestamp}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(allWords, null, 2));
    console.log(`📁 JSON data saved to ${outputPath}`);

    // Save to CSV with timestamp
    const csvPath = path.join(".", `twc_COMPLETE_${timestamp}.csv`);
    const csvHeader = "Headword,Reading,Romanized spelling,Freq\n";
    const csvData = allWords
      .map(
        (word) =>
          `"${word.headword}","${word.reading}","${word.romanizedSpelling}","${word.freq}"`,
      )
      .join("\n");

    fs.writeFileSync(csvPath, csvHeader + csvData);
    console.log(`📁 CSV data saved to ${csvPath}`);

    // Also save the legacy filenames for compatibility
    fs.writeFileSync("ajax_words.json", JSON.stringify(allWords, null, 2));
    fs.writeFileSync("ajax_words.csv", csvHeader + csvData);
    console.log(`📁 Legacy files updated: ajax_words.json, ajax_words.csv`);

    return allWords;
  } catch (error) {
    console.error("Error during AJAX scraping:", error);
    throw error;
  }
}

// Run the TWC data extractor
if (import.meta.main) {
  extractTWCData()
    .then((words) => {
      console.log("\n✅ TWC data extraction completed successfully!");
      console.log(`📊 Final count: ${words.length} words from 1,006 pages`);
      if (words.length > 0) {
        console.log("\n📝 Sample data:");
        console.log(words.slice(0, 5));
        console.log("...");
        console.log(words.slice(-5));
      }
    })
    .catch((error) => {
      console.error("❌ TWC data extraction failed:", error);
      process.exit(1);
    });
}

export { extractTWCData };
export type { WordData } from "./types";
