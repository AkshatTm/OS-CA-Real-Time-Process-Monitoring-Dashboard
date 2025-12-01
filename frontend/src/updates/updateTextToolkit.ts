/**
 * updateTextToolkit.ts
 *
 * Self-contained text processing utilities for demos and local analysis.
 * No imports — pure helpers only. Designed to be independent and unused unless integrated.
 *
 * Includes: normalization, tokenization, n-grams, similarity & fuzzy helpers,
 * small TF-IDF utilities, highlight helpers, simple text mock generators and analyzers.
 */

type TFMap = Record<string, number>;

const WORD_SPLIT_RE = /[\s\-_\/,.!?:;()"\[\]{}<>\\|]+/;
const NON_WORD_RE = /[^\p{L}\p{N}'’-]+/u;

/* --------------------
 * Normalization helpers
 * -------------------- */

/** Trim and collapse repeated whitespace to single spaces */
export const collapseWhitespace = (s: string): string =>
    s.replace(/\s+/g, ' ').trim();

/** Remove HTML tags (simple) and collapse whitespace */
export const stripHtmlTags = (s: string): string =>
    collapseWhitespace(s.replace(/<[^>]*>/g, ' '));

/** Basic HTML entity decode for common entities */
export const decodeHtmlEntities = (s: string): string => {
    if (!s) return s;
    return s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
};

/** Fully sanitize a string: strip HTML, decode entities, optionally lowercase */
export const sanitizeText = (input: string, opts?: { lower?: boolean; stripPunctuation?: boolean }): string => {
    let out = String(input ?? '');
    out = stripHtmlTags(out);
    out = decodeHtmlEntities(out);
    if (opts?.stripPunctuation) {
        out = out.replace(NON_WORD_RE, ' ');
    }
    out = collapseWhitespace(out);
    if (opts?.lower) out = out.toLowerCase();
    return out;
};

/** Remove diacritics (accents) using Unicode normalization */
export const removeDiacritics = (s: string): string =>
    s.normalize('NFKD').replace(/\p{M}/gu, '');

/** Escape a string for use in a regular expression */
export const regexEscape = (s: string): string =>
    s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* --------------------
 * Tokenizers & splitters
 * -------------------- */

/** Split into tokens respecting alphanum and apostrophes */
export const splitWords = (s: string): string[] =>
    sanitizeText(s, { stripPunctuation: true, lower: true })
        .split(WORD_SPLIT_RE)
        .filter(Boolean);

/** Split into sentences (heuristic) */
export const sentences = (s: string): string[] => {
    if (!s) return [];
    // naive: split on sentence end punctuation followed by space + capital or EOS
    const parts = s
        .replace(/\r\n/g, '\n')
        .split(/(?<=[.!?])\s+(?=[A-Z0-9"“”‘’])/)
        .map((p) => p.trim())
        .filter(Boolean);
    return parts.length ? parts : [s.trim()];
};

/* --------------------
 * N-grams & shingle utils
 * -------------------- */

/** Generate word n-grams */
export const wordNGrams = (s: string, n = 2): string[] => {
    const toks = splitWords(s);
    if (n <= 1) return toks;
    const out: string[] = [];
    for (let i = 0; i + n <= toks.length; i++) {
        out.push(toks.slice(i, i + n).join(' '));
    }
    return out;
};

/** Character n-grams (sliding over sanitized string) */
export const charNGrams = (s: string, n = 3): string[] => {
    const norm = sanitizeText(removeDiacritics(s), { lower: true, stripPunctuation: true }).replace(/\s+/g, '');
    if (n <= 0) return [];
    if (norm.length <= n) return [norm];
    const out: string[] = [];
    for (let i = 0; i + n <= norm.length; i++) out.push(norm.slice(i, i + n));
    return out;
};

/** Frequency map of n-grams */
export const ngramFrequency = (ngrams: string[]): Record<string, number> => {
    const m: Record<string, number> = {};
    for (const g of ngrams) m[g] = (m[g] ?? 0) + 1;
    return m;
};

/* --------------------
 * Distance & similarity
 * -------------------- */

/** Levenshtein distance (classic DP) */
export const levenshteinDistance = (a: string, b: string): number => {
    const A = String(a ?? '');
    const B = String(b ?? '');
    if (A === B) return 0;
    const n = A.length;
    const m = B.length;
    if (!n) return m;
    if (!m) return n;

    // use two-row DP for memory
    let prev = new Array(m + 1).fill(0).map((_, i) => i);
    let cur = new Array(m + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        cur[0] = i;
        const ai = A.charCodeAt(i - 1);
        for (let j = 1; j <= m; j++) {
            const cost = ai === B.charCodeAt(j - 1) ? 0 : 1;
            cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        }
        [prev, cur] = [cur, prev];
    }
    return prev[m];
};

/** Normalized Levenshtein similarity in [0,1] */
export const levenshteinSimilarity = (a: string, b: string): number => {
    const d = levenshteinDistance(a, b);
    const maxLen = Math.max(String(a).length, String(b).length);
    return maxLen === 0 ? 1 : 1 - d / maxLen;
};

/** Dice's coefficient for set-of-bigrams similarity */
export const diceCoefficient = (a: string, b: string): number => {
    const bigrams = (s: string) => {
        const norm = s.toLowerCase().replace(/\s+/g, '');
        const out: string[] = [];
        for (let i = 0; i < norm.length - 1; i++) out.push(norm.slice(i, i + 2));
        return out;
    };
    const A = bigrams(a);
    const B = bigrams(b);
    if (!A.length && !B.length) return 1;
    const setA = new Map<string, number>();
    for (const x of A) setA.set(x, (setA.get(x) ?? 0) + 1);
    let matches = 0;
    for (const x of B) {
        if ((setA.get(x) ?? 0) > 0) {
            matches++;
            setA.set(x, (setA.get(x) ?? 1) - 1);
        }
    }
    return (2 * matches) / (A.length + B.length);
};

/** Jaro similarity (basic) */
export const jaro = (s1: string, s2: string): number => {
    const a = String(s1 ?? '');
    const b = String(s2 ?? '');
    if (!a && !b) return 1;
    if (!a || !b) return 0;
    const la = a.length;
    const lb = b.length;
    const matchDist = Math.floor(Math.max(la, lb) / 2) - 1;
    const aMatches = new Array(la).fill(false);
    const bMatches = new Array(lb).fill(false);
    let matches = 0;
    for (let i = 0; i < la; i++) {
        const start = Math.max(0, i - matchDist);
        const end = Math.min(i + matchDist + 1, lb);
        for (let j = start; j < end; j++) {
            if (!bMatches[j] && a[i] === b[j]) {
                aMatches[i] = true;
                bMatches[j] = true;
                matches++;
                break;
            }
        }
    }
    if (!matches) return 0;
    let transpositions = 0;
    let k = 0;
    for (let i = 0; i < la; i++) {
        if (!aMatches[i]) continue;
        while (!bMatches[k]) k++;
        if (a[i] !== b[k]) transpositions++;
        k++;
    }
    transpositions = Math.floor(transpositions / 2);
    return (matches / la + matches / lb + (matches - transpositions) / matches) / 3;
};

/** Jaro-Winkler similarity with small prefix boosting */
export const jaroWinkler = (s1: string, s2: string, prefixScale = 0.1): number => {
    const j = jaro(s1, s2);
    if (j === 0) return 0;
    let prefix = 0;
    const maxPrefix = 4;
    for (let i = 0; i < Math.min(maxPrefix, s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) prefix++;
        else break;
    }
    return Math.min(1, j + prefix * prefixScale * (1 - j));
};

/* --------------------
 * TF / TF-IDF helpers
 * -------------------- */

/** Build term frequency map (simple, token-based) */
export const termFrequency = (text: string): TFMap => {
    const toks = splitWords(text);
    const m: TFMap = {};
    for (const t of toks) m[t] = (m[t] ?? 0) + 1;
    return m;
};

/** Merge term frequencies by summing */
export const mergeTFMaps = (a: TFMap, b: TFMap): TFMap => {
    const out: TFMap = { ...a };
    for (const k of Object.keys(b)) out[k] = (out[k] ?? 0) + b[k];
    return out;
};

/** Document frequency across documents */
export const documentFrequencies = (docs: string[]): Record<string, number> => {
    const df: Record<string, number> = {};
    for (const doc of docs) {
        const seen = new Set(splitWords(doc));
        for (const tok of seen) df[tok] = (df[tok] ?? 0) + 1;
    }
    return df;
};

/** Compute TF-IDF vector map for a single doc given DF map and total N docs */
export const tfidfForDoc = (doc: string, df: Record<string, number>, totalDocs: number): TFMap => {
    const tf = termFrequency(doc);
    const out: TFMap = {};
    for (const k of Object.keys(tf)) {
        const idf = Math.log((totalDocs + 1) / ((df[k] ?? 0) + 1)) + 1;
        out[k] = tf[k] * idf;
    }
    return out;
};

/** Cosine similarity for sparse vectors represented as TFMap */
export const cosineSimilarity = (a: TFMap, b: TFMap): number => {
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (const k of Object.keys(a)) {
        dot += a[k] * (b[k] ?? 0);
        na += a[k] * a[k];
    }
    for (const k of Object.keys(b)) {
        nb += b[k] * b[k];
    }
    if (!na || !nb) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

/* --------------------
 * Fuzzy search helpers
 * -------------------- */

export type FuzzyOptions = {
    caseSensitive?: boolean;
    minScore?: number; // 0..1 threshold
    scorer?: 'levenshtein' | 'jaro' | 'jaroWinkler' | 'dice' | 'tfidf';
    maxResults?: number;
};

/** Score a pair (document, query) using combined heuristics */
export const fuzzyScore = (doc: string, query: string, opts?: FuzzyOptions): number => {
    const q = opts?.caseSensitive ? query : query.toLowerCase();
    const d = opts?.caseSensitive ? doc : doc.toLowerCase();
    const scorer = opts?.scorer ?? 'jaroWinkler';
    // token overlap
    const qTokens = new Set(splitWords(q));
    const dTokens = new Set(splitWords(d));
    let overlap = 0;
    for (const t of qTokens) if (dTokens.has(t)) overlap++;
    const tokenCoverage = qTokens.size ? overlap / qTokens.size : 0; // 0..1

    let sim = 0;
    switch (scorer) {
        case 'levenshtein':
            sim = levenshteinSimilarity(d, q);
            break;
        case 'jaro':
            sim = jaro(d, q);
            break;
        case 'jaroWinkler':
            sim = jaroWinkler(d, q);
            break;
        case 'dice':
            sim = diceCoefficient(d, q);
            break;
        case 'tfidf':
            {
                const tf = termFrequency(d);
                const tfq = termFrequency(q);
                sim = cosineSimilarity(tf, tfq);
            }
            break;
    }

    // Combine similarity and token coverage; weight similarity higher
    return Math.max(0, Math.min(1, sim * 0.75 + tokenCoverage * 0.25));
};

/** Fuzzy search over an array of strings, returns matches with score */
export const fuzzySearch = (candidates: string[], query: string, opts?: FuzzyOptions) => {
    const rawScores = candidates.map((c) => ({ item: c, score: fuzzyScore(c, query, opts) }));
    const minScore = opts?.minScore ?? 0;
    const filtered = rawScores.filter((r) => r.score >= minScore);
    filtered.sort((a, b) => b.score - a.score);
    if (opts?.maxResults) return filtered.slice(0, opts.maxResults);
    return filtered;
};

/* --------------------
 * Highlighting helpers
 * -------------------- */

/** Highlight matches of query tokens within text by wrapping in tag strings */
export const highlightMatches = (text: string, query: string, tagOpen = '<em>', tagClose = '</em>', opts?: { caseSensitive?: boolean }) => {
    if (!query) return text;
    const cs = opts?.caseSensitive ?? false;
    const flags = cs ? 'g' : 'ig';
    const qToks = Array.from(new Set(splitWords(query))).filter(Boolean);
    if (!qToks.length) return text;
    let out = text;
    // escape tokens for regex
    for (const tok of qToks) {
        const re = new RegExp(regexEscape(tok), flags);
        out = out.replace(re, (m) => tagOpen + m + tagClose);
    }
    return out;
};

/* --------------------
 * Extractors / utilities
 * -------------------- */

/** Extract probable URLs from text (simple) */
export const extractUrls = (s: string): string[] => {
    const re = /https?:\/\/[^\s"'<>]+/ig;
    return Array.from((s.match(re) ?? [])).map((m) => m.trim());
};

/** Extract emails from text */
export const extractEmails = (s: string): string[] => {
    const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/ig;
    return Array.from((s.match(re) ?? [])).map((m) => m.trim());
};

/** Extract @mentions (# optional) */
export const extractMentions = (s: string): string[] => {
    const re = /@[\p{L}\p{N}_-]+/gu;
    return Array.from((s.match(re) ?? []));
};

/* --------------------
 * Text generation helpers (mock)
 * -------------------- */

const SAMPLE_WORDS = [
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'system', 'node', 'process', 'stream',
    'monitor', 'dashboard', 'signal', 'value', 'event', 'time', 'metric', 'status', 'error',
    'update', 'sync', 'task', 'queue', 'worker', 'request', 'response', 'session', 'token'
];

/** Generate a random sentence with approximate length */
export const generateSentence = (minWords = 4, maxWords = 12): string => {
    const n = Math.max(1, Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords);
    const parts: string[] = [];
    for (let i = 0; i < n; i++) {
        const w = SAMPLE_WORDS[Math.floor(Math.random() * SAMPLE_WORDS.length)];
        parts.push(w);
    }
    // Capitalize first, add punctuation
    let s = parts.join(' ');
    s = s.charAt(0).toUpperCase() + s.slice(1);
    const end = Math.random() < 0.05 ? '!' : Math.random() < 0.2 ? '...' : '.';
    return s + end;
};

/** Generate a paragraph of n sentences */
export const generateParagraph = (sentencesCount = 4): string =>
    Array.from({ length: Math.max(1, sentencesCount) }).map(() => generateSentence()).join(' ');

/** Generate multiple paragraphs */
export const generateParagraphs = (count = 3, sentencesEach = 4): string[] =>
    Array.from({ length: Math.max(0, count) }).map(() => generateParagraph(sentencesEach));

/* --------------------
 * Analysis helpers
 * -------------------- */

/** Word frequency map for text */
export const wordFrequency = (text: string): Record<string, number> => {
    const toks = splitWords(text);
    const m: Record<string, number> = {};
    for (const t of toks) m[t] = (m[t] ?? 0) + 1;
    return m;
};

/** Top N words (most frequent) */
export const topWords = (text: string, n = 10): { word: string; count: number }[] => {
    const freq = wordFrequency(text);
    const arr = Object.keys(freq).map((k) => ({ word: k, count: freq[k] }));
    arr.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
    return arr.slice(0, n);
};

/** Simple readability heuristic (average words per sentence) */
export const avgWordsPerSentence = (text: string): number => {
    const s = sentences(text);
    if (!s.length) return 0;
    const words = splitWords(text).length;
    return words / s.length;
};

/* --------------------
 * Expose convenient index of utilities
 * -------------------- */

export const textToolkitIndex = {
    // normalization
    collapseWhitespace,
    stripHtmlTags,
    decodeHtmlEntities,
    sanitizeText,
    removeDiacritics,
    regexEscape,
    // tokenization
    splitWords,
    sentences,
    // ngrams
    wordNGrams,
    charNGrams,
    ngramFrequency,
    // similarities
    levenshteinDistance,
    levenshteinSimilarity,
    diceCoefficient,
    jaro,
    jaroWinkler,
    // tfidf
    termFrequency,
    mergeTFMaps,
    documentFrequencies,
    tfidfForDoc,
    cosineSimilarity,
    // fuzzy search
    fuzzyScore,
    fuzzySearch,
    // highlight / extractors
    highlightMatches,
    extractUrls,
    extractEmails,
    extractMentions,
    // mock generators
    generateSentence,
    generateParagraph,
    generateParagraphs,
    // analysis
    wordFrequency,
    topWords,
    avgWordsPerSentence
};