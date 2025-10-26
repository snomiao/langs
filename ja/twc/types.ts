/**
 * Japanese word data extracted from TWC (Tsukuba Web Corpus)
 */
export interface WordData {
  /** The headword (main word form) */
  headword: string;
  /** Reading in hiragana/katakana */
  reading: string;
  /** Romanized spelling (romaji) */
  romanizedSpelling: string;
  /** Frequency count */
  freq: string;
}

/**
 * Internal word row structure from TWC API
 * @internal
 */
export interface WordRow {
  id: number;
  headword_id: string;
  headword: string;
  yomi_display: string;
  yomi1: string;
  yomi2: string;
  yomi3: string;
  romaji_display: string;
  romaji1: string;
  romaji2: string;
  romaji3: string;
  sortkey: string;
  freq: number;
  basicword: boolean;
  checked: boolean;
}

/**
 * API response structure from TWC
 * @internal
 */
export interface ApiResponse {
  rows?: WordRow[];
  total?: number;
  page?: number;
  records?: number;
}
