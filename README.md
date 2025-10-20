# Languages Dictionary Tree

A collection of free and open-source dictionary data for multiple languages, parsed into a unified YAML format.

## Languages Supported

- **Arabic** (العربية) - Arramooz Arabic Dictionary
- **Chinese** (中文) - CC-CEDICT
- **English** - Open English WordNet
- **French** (Français) - FreeDict French-English
- **Japanese** (日本語) - JMdict
- **Russian** (Русский) - OpenRussian.org
- **Spanish** (Español) - FreeDict Spanish-English + Spanish Word List

## Project Structure

```
.
├── data/
│   └── dict/
│       ├── arabic/
│       │   ├── raw/           # Raw source files
│       │   └── dict.yaml      # Parsed unified format
│       ├── chinese/
│       ├── english/
│       ├── french/
│       ├── japanese/
│       ├── russian/
│       ├── spanish/
│       └── README.md          # Detailed source information
├── ts/
│   ├── arabic-raw-2-yaml.ts
│   ├── chinese-raw-2-yaml.ts
│   ├── english-raw-2-yaml.ts
│   ├── french-raw-2-yaml.ts
│   ├── japanese-raw-2-yaml.ts
│   ├── russian-raw-2-yaml.ts
│   ├── spanish-raw-2-yaml.ts
│   └── parse-all.ts           # Run all parsers
└── docs/
    └── dict-structure.md      # Dictionary structure documentation
```

## Usage

### Prerequisites

- [Deno](https://deno.land/) runtime installed

### Parse All Dictionaries

To parse all raw dictionary files into unified YAML format:

```bash
deno run --allow-read --allow-write --allow-run ts/parse-all.ts
```

### Parse Individual Languages

You can also parse individual languages:

```bash
# Chinese
deno run --allow-read --allow-write ts/chinese-raw-2-yaml.ts

# Japanese
deno run --allow-read --allow-write ts/japanese-raw-2-yaml.ts

# French
deno run --allow-read --allow-write ts/french-raw-2-yaml.ts

# Spanish
deno run --allow-read --allow-write ts/spanish-raw-2-yaml.ts

# Russian
deno run --allow-read --allow-write ts/russian-raw-2-yaml.ts

# English
deno run --allow-read --allow-write ts/english-raw-2-yaml.ts

# Arabic
deno run --allow-read --allow-write ts/arabic-raw-2-yaml.ts
```

## Unified YAML Format

All dictionaries are parsed into a consistent YAML structure:

```yaml
metadata:
  source: "Dictionary Name"
  language: "ISO 639-1 code"
  target_language: "ISO 639-1 code"  # for bilingual dictionaries
  format: "original format"
  license: "License type"

entries:
  - word: "headword"
    pronunciation: "phonetic transcription"
    pos: "part of speech"
    gender: "m/f/n"  # if applicable
    translations:
      - lang: "en"
        text: "translation"
    forms:  # if applicable (e.g., Russian)
      singular:
        nominative: "form"
        genitive: "form"
        # ... other cases
      plural:
        # ... plural forms
    senses:  # for WordNet-style dictionaries
      - synset_id: "synset identifier"
        relations:
          - type: "relation type"
            target: "target word/sense"
```

## Data Sources

All dictionaries are from reputable open-source projects:

- **CC-CEDICT**: Community-maintained Chinese-English dictionary (CC BY-SA 4.0)
- **JMdict**: Japanese-multilingual dictionary from EDRDG (CC BY-SA 4.0)
- **FreeDict**: Multilingual translation dictionaries (GPL)
- **Open English WordNet**: English semantic lexicon (Open Source)
- **OpenRussian.org**: Russian language dictionary with full declensions (CC BY-SA)
- **Arramooz**: Arabic morphological dictionary (GPL)

For detailed source information and download URLs, see [data/dict/README.md](data/dict/README.md).

## License

This project's parsing scripts and structure are open source. Individual dictionaries retain their original licenses:

- **CC BY-SA 4.0**: Chinese (CC-CEDICT), Japanese (JMdict), Russian (OpenRussian)
- **GPL**: French (FreeDict), Spanish (FreeDict), Arabic (Arramooz)
- **MIT**: Spanish word list
- **Open Source**: English (Open English WordNet)

Please review individual license requirements in [data/dict/README.md](data/dict/README.md) before using these resources.

## Documentation

- [Dictionary Structure Analysis](docs/dict-structure.md) - Detailed analysis of dictionary components and formats

## Contributing

Contributions are welcome! To add a new language or improve parsers:

1. Add raw dictionary files to `data/dict/[lang]/raw/`
2. Create a parser script in `ts/[lang]-raw-2-yaml.ts`
3. Update documentation
4. Submit a pull request

## References

- [Electronic Dictionary Research and Development Group (EDRDG)](http://www.edrdg.org/)
- [FreeDict Project](https://freedict.org/)
- [MDBG Chinese Dictionary](https://www.mdbg.net/)
- [Open English WordNet](https://en-word.net/)
- [Arramooz Arabic Dictionary](https://github.com/linuxscout/arramooz)
- [OpenRussian.org](https://en.openrussian.org/)
- [(99+ 封私信 / 51 条消息) 不同语言之间的高频词是否存在显著差异？ - 知乎](https://www.zhihu.com/question/1960848724029843047)
- [そのボキャブラリーでどこまで理解できるのか？／英、仏、西、露、中、朝、日語の頻出順単語リストとカバー率 読書猿Classic: between / beyond readers](https://readingmonkey.blog.fc2.com/blog-entry-594.html)