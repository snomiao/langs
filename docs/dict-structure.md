# Dictionary Structure Analysis

This document describes the structure and content typically found in dictionary datasets, based on analysis of the raw dictionary files in this repository.

## Common Dictionary Components

### Core Elements

1. **Headword/Entry Word**
   - The word being defined (lemma)
   - May include variants (e.g., traditional/simplified Chinese)
   - Example: "人" (Chinese), "человек" (Russian), "maison" (French)

2. **Pronunciation**
   - Phonetic transcription (IPA, pinyin, etc.)
   - Stress marks and accents
   - Example: `/mɛ.zɔ̃/` (French IPA), `[ren2]` (Chinese pinyin)

3. **Part of Speech (POS)**
   - Grammatical category: noun (n), verb (v), adjective (adj), adverb (adv), etc.
   - May include subcategories: transitive/intransitive verbs, proper nouns

4. **Definitions/Translations**
   - One or more meanings or translations
   - Often numbered for multiple senses
   - May include context or usage notes

5. **Example Sentences**
   - Illustrative usage in context
   - May include translations

### Extended Information

6. **Grammatical Information**
   - Gender (masculine/feminine/neuter)
   - Number (singular/plural forms)
   - Declensions (case forms for nouns)
   - Conjugations (verb forms)
   - Animacy (animate/inanimate)

7. **Usage Information**
   - Register (formal, informal, slang, archaic)
   - Domain/Field (technical, medical, legal, etc.)
   - Frequency (common, rare)
   - Regional variations (dialectal differences)

8. **Cross-References**
   - Synonyms and antonyms
   - Related words
   - See-also references

9. **Etymology**
   - Word origin and history
   - Borrowed words and loanwords

## Format-Specific Structures

### TEI XML Format (FreeDict dictionaries)

Used by: French-English, Spanish-English dictionaries

```xml
<entry>
  <form>
    <orth>headword</orth>
    <pron>pronunciation</pron>
  </form>
  <gramGrp>
    <pos>part_of_speech</pos>
    <gen>gender</gen>
  </gramGrp>
  <sense>
    <cit type="trans">
      <quote>translation</quote>
    </cit>
  </sense>
</entry>
```

Key fields:
- `<orth>`: Orthographic form (spelling)
- `<pron>`: Pronunciation
- `<pos>`: Part of speech
- `<gen>`: Gender
- `<sense>`: Meaning/sense
- `<cit type="trans">`: Translation citation

### CC-CEDICT Format (Chinese)

Line-based format:
```
Traditional Simplified [pin1 yin1] /definition1/definition2/
```

Example:
```
人 人 [ren2] /person/people/
```

Fields:
- Traditional Chinese character(s)
- Simplified Chinese character(s)
- Pinyin pronunciation with tone numbers
- Definitions (slash-separated)

### JMdict XML Format (Japanese)

Complex XML structure:
```xml
<entry>
  <ent_seq>sequence_number</ent_seq>
  <k_ele>
    <keb>kanji_form</keb>
    <ke_pri>priority</ke_pri>
  </k_ele>
  <r_ele>
    <reb>reading</reb>
    <re_pri>priority</re_pri>
  </r_ele>
  <sense>
    <pos>part_of_speech</pos>
    <gloss>translation</gloss>
  </sense>
</entry>
```

Fields:
- `<ent_seq>`: Unique entry ID
- `<k_ele>`: Kanji element (written form)
- `<r_ele>`: Reading element (pronunciation in kana)
- `<sense>`: Meaning with POS and glosses
- `<ke_pri>`, `<re_pri>`: Priority/frequency indicators

### WordNet XML Format (English)

Structured semantic network:
```xml
<LexicalEntry id="...">
  <Lemma writtenForm="word" partOfSpeech="pos"/>
  <Sense id="..." synset="synset_id">
    <SenseRelation relType="..." target="..."/>
  </Sense>
</LexicalEntry>
```

Fields:
- `<Lemma>`: Word form and POS
- `<Sense>`: Word sense linked to synset
- `<SenseRelation>`: Semantic relations (synonyms, hypernyms, etc.)

### CSV Format (Russian, Spanish word lists)

Tabular data with headers:

**Russian Nouns CSV**:
- `bare`: Base form
- `accented`: Form with stress marks
- `translations_en`, `translations_de`: English/German translations
- `gender`: Grammatical gender (m/f/n)
- `animate`: Animacy flag
- `sg_nom`, `sg_gen`, `sg_dat`, `sg_acc`, `sg_inst`, `sg_prep`: Singular case forms
- `pl_nom`, `pl_gen`, `pl_dat`, `pl_acc`, `pl_inst`, `pl_prep`: Plural case forms

**Spanish Word List**:
- Simple JSON array of words

### DICT Format (Mueller Russian-English)

Text-based with special markup (appears to be HTML in the sample).

## Unified YAML Structure Proposal

For consistency across languages, we propose a unified YAML structure:

```yaml
entries:
  - word: "headword"
    pronunciation: "phonetic"
    pos: "part_of_speech"
    gender: "m/f/n"  # if applicable
    translations:
      - lang: "en"
        text: "translation"
      - lang: "de"
        text: "Übersetzung"
    senses:
      - definition: "meaning 1"
        examples:
          - "example sentence"
        domain: "field/context"
    forms:
      singular:
        nominative: "form"
        genitive: "form"
        # ... other cases
      plural:
        nominative: "form"
        # ... other cases
    variants:
      - form: "alternative spelling"
        script: "traditional/simplified"
    metadata:
      frequency: "common/rare"
      register: "formal/informal"
      etymology: "origin"
```

## Language-Specific Considerations

### Chinese
- Both traditional and simplified characters
- Pinyin with tone numbers
- Character vs. word entries

### Japanese
- Kanji and kana forms
- Multiple readings (on'yomi, kun'yomi)
- Complex part-of-speech tags

### Russian
- Full declension tables (6 cases × 2 numbers)
- Stress marks important
- Animacy distinction

### Arabic
- Root-based morphology
- Verb patterns (forms I-X)
- Diacritical marks for vowels

### French/Spanish
- Gender marking
- Regular/irregular verb conjugations
- Accents and diacritics

### English (WordNet)
- Semantic relations (synonyms, antonyms, hypernyms, hyponyms)
- Synsets (synonym sets)
- Cross-references between senses

## Summary

Dictionary datasets vary significantly in structure, from simple word lists to complex semantic networks. The unified YAML format should be flexible enough to accommodate:

1. Basic bilingual translation dictionaries
2. Monolingual dictionaries with definitions
3. Morphologically rich languages with full inflection tables
4. Semantic networks with relationship data

Not all fields will be populated for all languages or dictionary types, but the structure should support the full range of lexical information found in modern dictionaries.
