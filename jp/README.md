# Japanese Dictionary Sources

This directory contains open-source Japanese dictionary data in parsable text formats.

## Dictionary Sources

### 1. JMdict (Japanese-Multilingual Dictionary)
- **Project**: JMdict-EDICT Dictionary Project
- **Maintainer**: Electronic Dictionary Research and Development Group (EDRDG)
- **Website**: http://www.edrdg.org/jmdict/edict.html
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Entries**: ~199,000 entries (282,000 unique headword-reading combinations as of March 2023)
- **Formats Available**:
  - XML (JMdict.gz) - Complete dictionary in UTF-8
  - Plain text (EDICT2) - Enhanced format with multiple kanji/readings
  - Legacy text (EDICT) - Simple EUC-JP format
- **Download**: ftp://ftp.edrdg.org/pub/Nihongo/
- **Description**: The largest and most comprehensive open-source Japanese-English dictionary

### 2. JMnedict (Japanese Proper Names Dictionary)
- **Project**: JMnedict
- **Maintainer**: EDRDG
- **Website**: http://www.edrdg.org/enamdict/enamdict_doc.html
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Formats**: XML (UTF-8)
- **Download**: ftp://ftp.edrdg.org/pub/Nihongo/
- **Description**: Japanese proper names including given names, surnames, place names, company names, etc.

### 3. KANJIDIC2 (Kanji Dictionary)
- **Project**: KANJIDIC Project
- **Maintainer**: EDRDG
- **Website**: http://www.edrdg.org/wiki/index.php/KANJIDIC_Project
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Entries**: 13,108 kanji characters
- **Formats Available**:
  - XML (kanjidic2.xml.gz) - UTF-8, all kanji
  - Text (kanjidic) - EUC-JP, 6,355 JIS X 0208 kanji
- **Download**: http://www.edrdg.org/kanjidic/kanjd2index.html
- **Description**: Comprehensive kanji information including readings, meanings, stroke counts, radicals

### 4. KRADFILE/RADKFILE (Kanji Radical Decomposition)
- **Project**: KRADFILE/RADKFILE
- **Maintainer**: EDRDG
- **Website**: http://www.edrdg.org/krad/kradinf.html
- **License**: EDRDG License
- **Entries**: 6,355 JIS X 0208 kanji + 5,801 JIS X 0212 kanji
- **Formats**: Plain text
- **Download**: http://ftp.edrdg.org/pub/Nihongo/
- **Description**: Kanji decomposition into radicals and visual elements for component-based lookup

### 5. JmdictFurigana
- **Repository**: https://github.com/Doublevil/JmdictFurigana
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Format**: JSON (zipped)
- **Download**: GitHub Releases (auto-built monthly on the 25th)
- **Description**: JMdict with furigana attached to individual words

### 6. JMdict Simplified
- **Repository**: https://github.com/scriptin/jmdict-simplified
- **License**: Creative Commons Attribution-ShareAlike 3.0
- **Format**: JSON
- **Download**: GitHub repository
- **Description**: JMdict, JMnedict, KANJIDIC in simplified JSON format

### 7. Nihongo
- **Repository**: https://github.com/sph-mn/nihongo
- **License**: CC-BY-SA-4.0
- **Format**: CSV
- **Download**: GitHub repository
- **Description**: Japanese language data including 2,136 jōyō kanji with stroke counts, meanings, and readings

### 8. EJDict
- **Repository**: https://github.com/kujirahand/EJDict
- **License**: Public Domain
- **Format**: Text and SQLite
- **Download**: GitHub repository
- **Description**: English-Japanese dictionary in public domain

### 9. JapaneseDictionaryCollection
- **Repository**: https://github.com/JapaneseDatabase/JapaneseDictionaryCollection
- **License**: Various
- **Format**: Various
- **Download**: GitHub repository
- **Description**: Tools to collect Japanese words from trusted, open-source references

### 10. Yomitan Dictionaries
- **Repository**: https://github.com/yomidevs/jmdict-yomitan
- **License**: Various (includes JMdict, JMnedict, KANJIDIC)
- **Format**: JSON (Yomitan format)
- **Download**: GitHub Releases
- **Description**: Pre-built JMdict, JMnedict, KANJIDIC dictionaries for Yomitan/Yomichan browser extension

## File Formats

### XML Format
- Used by JMdict, JMnedict, KANJIDIC2
- UTF-8 encoded
- Well-structured with DTD definitions
- Suitable for comprehensive applications

### Plain Text Format
- EDICT format: `KANJI [KANA] /(general information) gloss/gloss/.../`
- EUC-JP or UTF-8 encoding
- Simple to parse
- Legacy format but still widely used

### JSON Format
- Modern format for web applications
- Easy to parse in most programming languages
- Used by simplified and third-party conversions

### CSV Format
- Simple tabular format
- Good for specific datasets like kanji lists
- Easy to import into databases or spreadsheets

## Usage Notes

1. **Attribution Required**: Most dictionaries require attribution when used in applications
2. **License Compliance**: Check specific license terms (CC-BY-SA 3.0, Public Domain, etc.)
3. **Update Frequency**: EDRDG dictionaries are updated regularly; check for new versions
4. **Encoding**: Pay attention to character encoding (UTF-8 vs EUC-JP)
5. **Text Only**: This collection focuses on text data; audio and images are excluded

## References

- EDRDG Main Site: http://www.edrdg.org/
- Jim Breen's Japanese Page: http://www.csse.monash.edu.au/~jwb/japanese.html
- EDRDG Wiki: http://www.edrdg.org/wiki/
