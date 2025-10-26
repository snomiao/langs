# BCCWJ Word Frequency Data Extraction

This directory contains the extraction script for the **Balanced Corpus of Contemporary Written Japanese (BCCWJ)** word frequency list.

## Data Source

- **Website**: [BCCWJ Word List](https://clrd.ninjal.ac.jp/bccwj/en/freq-list.html)
- **DOI**: [10.15084/00003218](http://doi.org/10.15084/00003218)
- **Data**: Short Unit Word (SUW) frequency list v1.0

## Extraction Script

The `extract.ts` script uses Playwright to:
1. Navigate to the BCCWJ word list page
2. Download the ZIP file from the NINJAL repository
3. Extract and parse the TSV data
4. Convert to JSON and CSV formats

## Usage

```bash
bun extract.ts
```

## Output Files

- `bccwj_words.json` - JSON format with all word data (38 MB, 185,136 words)
- `bccwj_words.csv` - CSV format for easy import (16 MB)
- `BCCWJ_frequencylist_suw_ver1_0.zip` - Original downloaded ZIP file
- `extracted/` - Extracted TSV file from the ZIP

## Data Structure

Each word entry contains:

- **rank**: Frequency rank (1 = most frequent)
- **lForm**: Written form (表記形)
- **lemma**: Lemma/headword (基本形)
- **pos**: Part of speech (品詞)
- **subLemma**: Sub-lemma (alternative form)
- **wType**: Word type (語種)
  - `和` (wago) - native Japanese words
  - `漢` (kango) - Sino-Japanese words
  - `外` (gairaigo) - loanwords
  - `混` (konseigo) - mixed
  - `固` (koyūmeishi) - proper nouns
- **frequency**: Raw frequency count
- **pmw**: Per million words (normalized frequency)

## Sample Data

Top 5 most frequent words:

| Rank | lForm | Lemma | POS | Frequency | PMW |
|------|-------|-------|-----|-----------|-----|
| 1 | ノ | の | 助詞-格助詞 | 5,061,558 | 48,383.9 |
| 2 | ニ | に | 助詞-格助詞 | 3,576,558 | 34,188.7 |
| 3 | テ | て | 助詞-接続助詞 | 3,493,117 | 33,391.0 |
| 4 | ハ | は | 助詞-係助詞 | 3,289,932 | 31,448.8 |
| 5 | ダ | だ | 助動詞 | 3,156,903 | 30,177.1 |

## Statistics

- Total words: **185,136**
- Extraction time: ~10 seconds
- Data coverage: Complete BCCWJ Short Unit Word frequency list

## References

- [BCCWJ Official Page](https://clrd.ninjal.ac.jp/bccwj/)
- [NINJAL (National Institute for Japanese Language and Linguistics)](https://www.ninjal.ac.jp/)
