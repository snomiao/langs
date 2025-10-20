# Dictionary Data Summary

This document provides a comprehensive overview of the dictionary data included in this project, including word counts, formats, and explanations of each dictionary source.

## Overview

The project includes high-quality, open-source dictionary data for **7 languages**: Arabic, Chinese, English, French, Japanese, Russian, and Spanish. All dictionaries are freely available under open licenses and come from reputable sources.

## Language Coverage

### Japanese (日本語)

**JMdict - 213,836 entries**
- The JMdict is one of the most comprehensive Japanese-English dictionaries available as open source
- Includes ~199,000 dictionary entries with 282,000 unique headword-reading combinations
- Covers vocabulary from classical to modern Japanese, including technical terms, slang, and regional variations
- Provides multiple readings (kanji and kana), part-of-speech tags, definitions in multiple languages, and cross-references
- Maintained by the Electronic Dictionary Research and Development Group (EDRDG), a trusted authority in Japanese linguistic resources
- Format: XML (gzipped)
- License: CC BY-SA 4.0

### Chinese (中文)

**CC-CEDICT - 124,037 entries**
- Community-maintained Chinese-English dictionary with extensive coverage of modern Mandarin
- Includes both traditional and simplified character forms for each entry
- Provides pinyin pronunciation with tone marks for accurate phonetic guidance
- Covers modern vocabulary including technical terms, internet slang, and colloquial expressions
- Actively maintained with frequent updates from contributors worldwide
- Based on the CEDICT format, widely used in Chinese learning applications
- Format: Plain text with structured format (UTF-8, gzipped)
- License: CC BY-SA 4.0

### French (Français)

**FreeDict French-English Dictionary - 150,083 entries**
- Part of the FreeDict project, a long-standing effort to create free bilingual dictionaries
- Comprehensive coverage of French vocabulary from common to specialized terms
- Includes grammatical information, usage examples, and idiomatic expressions
- Suitable for both language learners and professional translators
- TEI XML format allows for rich linguistic annotation and metadata
- Format: TEI XML (Text Encoding Initiative standard)
- License: GPL

### English

**Open English WordNet - 161,705 lexical entries**
- Modern fork of Princeton WordNet with over 18,500 improvements
- Organized as a semantic network connecting words through meaning relationships
- Includes synsets (groups of synonymous words), definitions, usage examples, and semantic relations
- Covers nouns, verbs, adjectives, and adverbs with detailed part-of-speech information
- Essential resource for natural language processing, semantic analysis, and computational linguistics
- Actively maintained with regular updates and corrections
- Format: XML (gzipped)
- License: Open source

### Spanish (Español)

**FreeDict Spanish-English Dictionary - 60,096 entries**
- Comprehensive bilingual dictionary from the FreeDict project
- Covers vocabulary from Spain and Latin America
- Includes grammatical information, gender markers, and regional usage notes
- TEI XML format provides detailed linguistic markup
- Format: TEI XML
- License: GPL

**Spanish Word List - 1 entry file**
- Supplementary Spanish vocabulary resource
- Originally from the "An Array of Spanish Words" project
- Provides additional coverage for Spanish vocabulary
- Format: CSV
- License: MIT

### Russian (Русский)

**Mueller English-Russian Dictionary - 957 entries**
- Classic English-Russian dictionary dating back to Soviet era
- Known for comprehensive coverage including phonetic transcription
- Includes over 46,000 articles with detailed translations
- Particularly strong in technical and scientific vocabulary
- Format: Plain text (DICT format)
- License: GPL

**OpenRussian Dictionary Data - 26,983 noun entries**
- Modern, community-driven Russian language resource
- Provides detailed morphological information for Russian words
- Includes grammatical gender, declension patterns, and stress marks
- Covers nouns with comprehensive inflection data
- Actively maintained with user contributions
- Format: CSV (structured data)
- License: CC BY-SA

### Arabic (العربية)

**Arramooz Arabic Dictionary**
- Specialized dictionary for Arabic morphological analysis
- Includes extensive verb conjugation data (verbs.ods)
- Provides detailed noun declension patterns (nouns.ods)
- Essential for Arabic natural language processing and computational linguistics
- Covers Modern Standard Arabic with comprehensive grammatical information
- Part of the Arramooz project focused on Arabic language tools
- Format: ODS (OpenDocument Spreadsheet) - allows for complex tabular data
- License: GPL

## Total Coverage

- **7 languages** covered
- **~740,000+ total entries** across all dictionaries
- Multiple formats: XML, TEI, CSV, plain text, ODS
- All data is **freely available** under open licenses (CC BY-SA, GPL, MIT)

## Technical Details

### File Formats

1. **XML/TEI XML**: Structured markup allowing rich linguistic annotation, semantic relationships, and metadata
2. **Plain Text**: Simple, easily parsable format with consistent structure
3. **CSV**: Tabular data ideal for structured information like word lists and inflection tables
4. **ODS**: OpenDocument Spreadsheet format for complex tabular data with multiple sheets

### Compression

Several large dictionaries are distributed in gzipped format (`.gz`) to reduce storage and download size:
- JMdict.gz (Japanese)
- cedict_ts.u8.gz (Chinese)
- wordnet-2024.xml.gz (English)

To decompress: `gunzip filename.gz`

### Data Quality

All dictionaries included in this project are:
- **Actively maintained** by reputable organizations or communities
- **Peer-reviewed** with established quality control processes
- **Widely used** in academic, commercial, and open-source projects
- **Well-documented** with clear licensing and attribution requirements

## Use Cases

These dictionaries support various applications:

1. **Language Learning Apps**: Vocabulary building, flashcards, translation practice
2. **Natural Language Processing**: Semantic analysis, machine translation, text generation
3. **Linguistic Research**: Corpus analysis, lexicography, computational linguistics
4. **Translation Tools**: Bilingual dictionaries for human and machine translation
5. **Search and Information Retrieval**: Query expansion, synonym detection, semantic search
6. **Educational Resources**: Reference materials for students and teachers

## License Summary

| Language | Dictionary | License | Attribution Required |
|----------|-----------|---------|---------------------|
| Japanese | JMdict | CC BY-SA 4.0 | Yes |
| Chinese | CC-CEDICT | CC BY-SA 4.0 | Yes |
| French | FreeDict FR-EN | GPL | Yes |
| English | Open English WordNet | Open Source | Check license |
| Spanish | FreeDict ES-EN | GPL | Yes |
| Spanish | Spanish Word List | MIT | Yes |
| Russian | Mueller Dict | GPL | Yes |
| Russian | OpenRussian | CC BY-SA | Yes |
| Arabic | Arramooz | GPL | Yes |

## Attribution Requirements

When using these dictionaries, please provide proper attribution:

- **JMdict**: "This software uses the JMdict dictionary files. These files are the property of the Electronic Dictionary Research and Development Group, and are used in conformance with the Group's licence."
- **CC-CEDICT**: "CC-CEDICT is provided by MDBG, licensed under CC BY-SA 4.0"
- **FreeDict**: "Dictionary data from the FreeDict project, licensed under GPL"
- **Open English WordNet**: Check current attribution requirements at https://en-word.net/
- **OpenRussian**: "Russian language data from OpenRussian.org, licensed under CC BY-SA"
- **Arramooz**: "Arabic dictionary data from the Arramooz project, licensed under GPL"

## Updates and Maintenance

Most of these dictionaries are actively maintained and updated regularly:

- **JMdict**: Monthly updates
- **CC-CEDICT**: Continuous community updates
- **Open English WordNet**: Annual releases with continuous improvements
- **OpenRussian**: Community-driven updates
- **FreeDict**: Periodic updates by maintainers
- **Arramooz**: Periodic updates

Check the [data/dict/README.md](../data/dict/README.md) file for download URLs to get the latest versions.

## Contributing

To add or update dictionary sources:

1. Ensure the dictionary is freely available under an open license
2. Verify the source is reputable and actively maintained
3. Add dictionary files to the appropriate `language/raw/` directory
4. Update both this summary and the main README with source details
5. Include word/entry counts and license information
6. Submit a pull request

## References

- [Electronic Dictionary Research and Development Group (EDRDG)](http://www.edrdg.org/)
- [FreeDict Project](https://freedict.org/)
- [MDBG Chinese Dictionary](https://www.mdbg.net/)
- [Open English WordNet](https://en-word.net/)
- [Arramooz Arabic Dictionary](https://github.com/linuxscout/arramooz)
- [OpenRussian.org](https://en.openrussian.org/)
- [Mueller Dictionary Project](https://mueller-dict.sourceforge.net/)
