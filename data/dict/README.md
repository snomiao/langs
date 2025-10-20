# Dictionary Data Sources

This directory contains free and open-source dictionary data for multiple languages. All dictionaries are from reputable sources and are freely available under various open licenses.

## Japanese (日本語)

### JMdict
- **File**: `japanese/raw/JMdict.gz`
- **Source**: [EDRDG - Electronic Dictionary Research and Development Group](http://www.edrdg.org/jmdict/edict.html)
- **License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **Description**: Japanese-Multilingual Dictionary containing approximately 199,000 entries with 282,000 unique headword-reading combinations
- **Format**: XML (gzipped)
- **Download URL**: http://ftp.edrdg.org/pub/Nihongo/JMdict.gz

## Chinese (中文)

### CC-CEDICT
- **File**: `chinese/raw/cedict_ts.u8.gz`
- **Source**: [MDBG Chinese Dictionary](https://www.mdbg.net/chinese/dictionary?page=cedict)
- **License**: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
- **Description**: Chinese-English dictionary with ~124,000 entries, including both traditional and simplified Chinese
- **Format**: Text file (UTF-8, gzipped)
- **Download URL**: https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz

## French (Français)

### FreeDict French-English Dictionary
- **File**: `french/raw/freedict-fra-eng.txt`
- **Source**: [FreeDict Project](https://freedict.org/)
- **License**: GNU General Public License (GPL)
- **Description**: Comprehensive French-English dictionary from the FreeDict project
- **Format**: TEI XML
- **Download URL**: https://raw.githubusercontent.com/freedict/fd-dictionaries/master/fra-eng/fra-eng.tei

## English

### Open English WordNet
- **File**: `english/raw/wordnet-2024.xml.gz`
- **Source**: [Open English WordNet](https://en-word.net/)
- **License**: Open source (fork of Princeton WordNet)
- **Description**: Open English WordNet 2024 edition with over 18,500 improvements over Princeton WordNet
- **Format**: XML (gzipped)
- **Download URL**: https://en-word.net/static/english-wordnet-2024.xml.gz

## Spanish (Español)

### FreeDict Spanish-English Dictionary
- **File**: `spanish/raw/spa-eng.tei`
- **Source**: [FreeDict Project](https://freedict.org/)
- **License**: GNU General Public License (GPL)
- **Description**: Spanish-English dictionary from the FreeDict project
- **Format**: TEI XML
- **Download URL**: https://raw.githubusercontent.com/freedict/fd-dictionaries/master/spa-eng/spa-eng.tei

### Spanish Word List
- **File**: `spanish/raw/spanish-dict.csv`
- **Source**: [An Array of Spanish Words](https://github.com/words/an-array-of-spanish-words)
- **License**: MIT
- **Description**: Comprehensive list of Spanish words
- **Format**: JSON
- **Download URL**: https://github.com/words/an-array-of-spanish-words/raw/master/index.json

## Russian (Русский)

### Mueller English-Russian Dictionary
- **File**: `russian/raw/mueller7-dict.txt`
- **Source**: [Mueller Dictionary Project](https://mueller-dict.sourceforge.net/)
- **License**: GNU General Public License (GPL)
- **Description**: English-Russian dictionary with over 46,000 articles including phonetic transcription
- **Format**: Text (DICT format)
- **Download URL**: https://sourceforge.net/projects/mueller-dict/

### OpenRussian Dictionary Data
- **Files**:
  - `russian/raw/russian-nouns.csv`
  - `russian/raw/words.csv`
- **Source**: [OpenRussian.org](https://github.com/Badestrand/russian-dictionary)
- **License**: Creative Commons Attribution-ShareAlike (CC BY-SA)
- **Description**: Dataset of Russian nouns, verbs, adjectives from OpenRussian.org
- **Format**: CSV
- **Download URL**: https://github.com/Badestrand/russian-dictionary

## Arabic (العربية)

### Arramooz Arabic Dictionary
- **Files**:
  - `arabic/raw/verbs.ods`
  - `arabic/raw/nouns.ods`
- **Source**: [Arramooz Project](https://github.com/linuxscout/arramooz)
- **License**: GNU General Public License (GPL)
- **Description**: Arabic dictionary for morphological analysis with extensive verb and noun data
- **Format**: ODS (OpenDocument Spreadsheet)
- **Download URLs**:
  - https://github.com/linuxscout/arramooz/raw/master/data/verbs.ods
  - https://github.com/linuxscout/arramooz/raw/master/data/nouns.ods

## Usage Notes

1. **Compressed Files**: Files ending in `.gz` need to be decompressed before use:
   ```bash
   gunzip filename.gz
   ```

2. **Format Conversion**: Some files are in XML/TEI format and may need conversion depending on your use case.

3. **Attribution**: When using these dictionaries, please ensure you comply with the respective licenses and provide proper attribution to the original sources.

4. **Updates**: These dictionaries are periodically updated by their maintainers. Check the source URLs for the latest versions.

## License Compliance

All dictionaries included here are freely available under open-source licenses:
- Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)
- GNU General Public License (GPL/LGPL/MPL)
- MIT License

Please review individual license files and attribution requirements before using these resources in your projects.

## Contributing

To update or add new dictionary sources:
1. Ensure the dictionary is freely available under an open license
2. Add the dictionary file to the appropriate language directory under `raw/`
3. Update this README with source information and license details
4. Submit a pull request with your changes

## References

- [Electronic Dictionary Research and Development Group (EDRDG)](http://www.edrdg.org/)
- [FreeDict Project](https://freedict.org/)
- [MDBG Chinese Dictionary](https://www.mdbg.net/)
- [Open English WordNet](https://en-word.net/)
- [Arramooz Arabic Dictionary](https://github.com/linuxscout/arramooz)
- [OpenRussian.org](https://en.openrussian.org/)
