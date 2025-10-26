/**
 * @snomiao/langs - Linguistic research tools and language corpus data collector
 *
 * This package provides utilities for linguistic research, including:
 * - Japanese word corpus extraction from TWC (Tsukuba Web Corpus)
 * - Language model research utilities
 * - Word frequency analysis tools
 *
 * @packageDocumentation
 */

export { extractTWCData } from "./ja/twc/extract";

// Re-export types for convenience
export type { WordData } from "./ja/twc/types";
