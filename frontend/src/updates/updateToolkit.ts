/**
 * updateToolkit.ts
 *
 * Large standalone collection of isolated utilities intended for development demos,
 * learning experiments and small analysis tasks. This file intentionally has no imports,
 * no runtime side-effects, and is safe to keep unused until you choose to integrate.
 *
 * Contents (high level):
 *  - string formatters and helpers
 *  - date utilities and simple calendaring helpers
 *  - array and math helpers / small algorithms
 *  - CSV and parsing helpers
 *  - validators (email, URL, credit-card Luhn, uuid-like)
 *  - lightweight mock data generators (products, sensors, logs, transactions)
 *  - analysers (text stats, simple readability score, numeric summaries)
 *  - color utilities and conversions
 *  - small functional utils (debounce, throttle, memoize, once)
 *
 * File size purposefully large and self-contained so it does not modify or rely on
 * existing application logic.
 */

/* =========================
 * Basic constants & helpers
 * ========================= */

export const CHAR_WORDS = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'integer', 'nec', 'orci', 'pharetra', 'malesuada', 'curabitur', 'vehicula', 'nisi'
];

export const DEFAULT_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];

/* =========================
 * String utils
 * ========================= */

/**
 * Convert text to Title Case.
 */
export const titleCase = (s: string): string =>
    s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

/**
 * Convert text to snake_case.
 */
export const snakeCase = (s: string): string =>
    s
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();

/**
 * Convert text to kebab-case.
 */
export const kebabCase = (s: string): string =>
    s
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();

/**
 * Convert kebab/snake/space-delimited to camelCase.
 */
export const camelCase = (s: string): string =>
    s
        .trim()
        .split(/[\s-_]+/)
        .map((part, i) => (i === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()))
        .join('');

/**
 * Simple slugify for URLs and filenames.
 */
export const slugify = (s: string): string =>
    s
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '');

/**
 * Truncate a string and append a suffix (default elipsis).
 */
export const truncate = (s: string, length = 140, suffix = '…'): string =>
    s.length > length ? s.slice(0, Math.max(0, length - suffix.length)).trim() + suffix : s;

/**
 * Repeat a string n times.
 */
export const repeat = (s: string, n = 1): string => new Array(Math.max(0, Math.floor(n))).fill(s).join('');

/**
 * Safe join words with commas and 'and' for small lists.
 */
export const joinWithAnd = (items: string[], oxford = true) => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    const head = items.slice(0, -1).join(', ');
    const tail = items[items.length - 1];
    return oxford ? `${head}, and ${tail}` : `${head} and ${tail}`;
};

/* =========================
 * Random / generation helpers
 * ========================= */

/**
 * Random int inclusive.
 */
export const randInt = (min: number, max: number): number =>
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

/**
 * Random float in [min, max).
 */
export const rand = (min = 0, max = 1): number => Math.random() * (max - min) + min;

/**
 * Random choice from array.
 */
export const choice = <T>(arr: T[]): T | undefined => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined);

/**
 * Simple random string generator.
 */
export const randomString = (length = 8, chars = 'abcdefghijklmnopqrstuvwxyz0123456789') => {
    let out = '';
    const n = chars.length;
    for (let i = 0; i < Math.max(0, length); i++) {
        out += chars.charAt(Math.floor(Math.random() * n));
    }
    return out;
};

/* =========================
 * Date utilities
 * ========================= */

/**
 * Robust parse to Date — supports Date, number, and ISO-like strings.
 */
export const toDate = (input: Date | number | string | null | undefined): Date | null => {
    if (input instanceof Date) return new Date(input.getTime());
    if (typeof input === 'number' && !Number.isNaN(input)) return new Date(input);
    if (typeof input === 'string' && input.trim()) {
        const parsed = new Date(input);
        if (!Number.isNaN(parsed.getTime())) return parsed;
        // Try some common fallbacks: yyyy-mm-dd or yyyy/mm/dd
        const isoLike = input.trim().replace(/-/g, '/');
        const p2 = new Date(isoLike);
        return Number.isNaN(p2.getTime()) ? null : p2;
    }
    return null;
};

/**
 * Format date using a very small formatter — supports tokens: YYYY, MM, DD, hh, mm, ss.
 */
export const formatDate = (input: Date | number | string | null | undefined, format = 'YYYY-MM-DD hh:mm:ss'): string => {
    const d = toDate(input);
    if (!d) return '';
    const pad = (v: number, l = 2) => String(v).padStart(l, '0');
    const map: Record<string, string> = {
        YYYY: String(d.getFullYear()),
        MM: pad(d.getMonth() + 1),
        DD: pad(d.getDate()),
        hh: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds())
    };
    return format.replace(/YYYY|MM|DD|hh|mm|ss/g, (m) => map[m] ?? m);
};

/**
 * Calculate days between two dates (rounded down).
 */
export const daysBetween = (a: Date | number | string, b: Date | number | string): number => {
    const da = toDate(a);
    const db = toDate(b);
    if (!da || !db) return 0;
    const diff = Math.abs(da.getTime() - db.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
};

/**
 * Add days (positive/negative), returns new Date.
 */
export const addDays = (input: Date | number | string, days = 0): Date => {
    const d = toDate(input) ?? new Date();
    const out = new Date(d.getTime());
    out.setDate(out.getDate() + Math.floor(days));
    return out;
};

/**
 * Start of day (local time) — returned Date is independent clone.
 */
export const startOfDay = (input: Date | number | string) => {
    const d = toDate(input) ?? new Date();
    const out = new Date(d.getTime());
    out.setHours(0, 0, 0, 0);
    return out;
};

/**
 * End of day (local).
 */
export const endOfDay = (input: Date | number | string) => {
    const d = toDate(input) ?? new Date();
    const out = new Date(d.getTime());
    out.setHours(23, 59, 59, 999);
    return out;
};

/**
 * Format a duration (ms) into human readable string like "1h 10m 5s".
 */
export const formatDuration = (ms: number): string => {
    const sign = ms < 0 ? '-' : '';
    let rem = Math.abs(Math.floor(ms));
    const hours = Math.floor(rem / (1000 * 60 * 60));
    rem -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(rem / (1000 * 60));
    rem -= minutes * 1000 * 60;
    const seconds = Math.floor(rem / 1000);
    rem -= seconds * 1000;
    const parts: string[] = [];
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds || (!hours && !minutes)) parts.push(`${seconds}s`);
    if (rem) parts.push(`${rem}ms`);
    return sign + parts.join(' ');
};

/* =========================
 * Array utilities & algorithms
 * ========================= */

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export const shuffle = <T>(arr: T[], seed?: number): T[] => {
    // If seed provided, use seeded RNG (simple LCG) — safe for demo only.
    let randomFn = Math.random;
    if (typeof seed === 'number') {
        let s = Math.floor(seed);
        randomFn = () => {
            // basic LCG parameters
            s = (s * 1664525 + 1013904223) % 4294967296;
            return s / 4294967296;
        };
    }
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(randomFn() * (i + 1));
        const t = a[i];
        a[i] = a[j];
        a[j] = t;
    }
    return a;
};

/**
 * Chunk an array into equal sized groups (last group may be smaller).
 */
export const chunk = <T>(arr: T[], size = 1): T[][] => {
    if (!arr.length || size <= 0) return [];
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        out.push(arr.slice(i, i + size));
    }
    return out;
};

/**
 * Unique values with optional key selector.
 */
export const unique = <T>(arr: T[], key?: (x: T) => string | number): T[] => {
    if (!key) return Array.from(new Set(arr as unknown as any)) as T[];
    const seen = new Set<string | number>();
    const out: T[] = [];
    for (const x of arr) {
        const k = key(x);
        if (!seen.has(k)) {
            seen.add(k);
            out.push(x);
        }
    }
    return out;
};

/**
 * Rotate array left by n (negative rotates right).
 */
export const rotate = <T>(arr: T[], n = 1): T[] => {
    if (!arr.length) return [];
    const len = arr.length;
    const r = ((n % len) + len) % len;
    return arr.slice(r).concat(arr.slice(0, r));
};

/**
 * Weighted random choice.
 * weights must be same length as values and non-negative.
 */
export const weightedRandom = <T>(values: T[], weights: number[]): T | undefined => {
    if (!values.length || values.length !== weights.length) return undefined;
    let total = 0;
    for (const w of weights) {
        if (w < 0) return undefined;
        total += w;
    }
    if (total === 0) return undefined;
    let r = Math.random() * total;
    for (let i = 0; i < values.length; i++) {
        r -= weights[i];
        if (r <= 0) return values[i];
    }
    // fallback
    return values[values.length - 1];
};

/**
 * Reservoir sample of k items from array source, single-pass.
 */
export const reservoirSample = <T>(arr: T[], k = 1): T[] => {
    const n = arr.length;
    if (k <= 0) return [];
    if (k >= n) return arr.slice();
    const res: T[] = arr.slice(0, k);
    for (let i = k; i < n; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        if (j < k) res[j] = arr[i];
    }
    return res;
};

/* =========================
 * Math helpers
 * ========================= */

/**
 * Greatest common divisor (Euclidean).
 */
export const gcd = (a: number, b: number): number => {
    let x = Math.abs(Math.floor(a));
    let y = Math.abs(Math.floor(b));
    if (!x) return y;
    if (!y) return x;
    while (y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
};

/**
 * Least common multiple.
 */
export const lcm = (a: number, b: number): number => {
    if (!a || !b) return 0;
    return Math.abs((a / gcd(a, b)) * b);
};

/**
 * Factorial (safely capped; returns 1 for n <= 1).
 */
export const factorial = (n: number): number => {
    let k = Math.floor(n);
    if (k <= 1) return 1;
    // cap at 170 to avoid Infinity in JS Number
    k = Math.min(k, 170);
    let out = 1;
    for (let i = 2; i <= k; i++) out *= i;
    return out;
};

/**
 * nCk (combinations)
 */
export const combinations = (n: number, k: number): number => {
    let nn = Math.floor(n);
    let kk = Math.floor(k);
    if (kk < 0 || nn < 0 || kk > nn) return 0;
    kk = Math.min(kk, nn - kk);
    let res = 1;
    for (let i = 1; i <= kk; i++) {
        res = (res * (nn - kk + i)) / i;
    }
    return Math.round(res);
};

/**
 * nth Fibonacci number (iterative).
 */
export const fibonacci = (n: number): number => {
    const k = Math.max(0, Math.floor(n));
    if (k === 0) return 0;
    if (k === 1) return 1;
    let a = 0, b = 1;
    for (let i = 2; i <= k; i++) {
        const t = a + b;
        a = b;
        b = t;
        if (!Number.isFinite(b)) return Infinity;
    }
    return b;
};

/* =========================
 * Simple data structures (in-file)
 * ========================= */

/**
 * A tiny circular buffer for demos (no external effects).
 */
export class RingBuffer<T> {
    private buffer: (T | undefined)[];
    private head = 0;
    private tail = 0;
    private size = 0;
    constructor(public capacity: number) {
        this.capacity = Math.max(1, Math.floor(capacity));
        this.buffer = new Array(this.capacity);
    }
    push(item: T): T | undefined {
        let evicted: T | undefined;
        if (this.size === this.capacity) {
            // overwrite head
            evicted = this.buffer[this.head];
            this.buffer[this.head] = item;
            this.head = (this.head + 1) % this.capacity;
            this.tail = (this.tail + 1) % this.capacity;
        } else {
            this.buffer[this.tail] = item;
            this.tail = (this.tail + 1) % this.capacity;
            this.size++;
        }
        return evicted;
    }
    toArray(): T[] {
        const out: T[] = [];
        for (let i = 0; i < this.size; i++) {
            const idx = (this.head + i) % this.capacity;
            const v = this.buffer[idx];
            if (v !== undefined) out.push(v);
        }
        return out;
    }
    clear() {
        this.head = 0;
        this.tail = 0;
        this.size = 0;
        this.buffer = new Array(this.capacity);
    }
    get length() {
        return this.size;
    }
}

/* =========================
 * CSV helpers (tiny)
 * ========================= */

/**
 * Detect probable CSV delimiter by sampling line.
 */
export const detectDelimiter = (csvText: string): string => {
    const candidates = [',', '\t', ';', '|'];
    const lines = csvText.split(/\r\n|\n|\r/).filter(Boolean);
    if (!lines.length) return ',';
    const sample = lines[0];
    let best = candidates[0];
    let bestCount = -1;
    for (const c of candidates) {
        const count = sample.split(c).length;
        if (count > bestCount) {
            bestCount = count;
            best = c;
        }
    }
    return best;
};

/**
 * Very small CSV parser — supports quoted fields with escaped double quotes.
 * Returns rows as arrays.
 */
export const parseCSV = (text: string, delimiter?: string): string[][] => {
    if (!text) return [];
    const delim = delimiter ?? detectDelimiter(text);
    const rows: string[][] = [];
    // basic finite state machine
    let i = 0;
    const length = text.length;
    let row: string[] = [];
    let field = '';
    let inQuotes = false;
    while (i < length) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"') {
                if (i + 1 < length && text[i + 1] === '"') {
                    field += '"';
                    i += 2;
                    continue;
                }
                inQuotes = false;
                i++;
                continue;
            }
            field += ch;
            i++;
            continue;
        }
        if (ch === '"') {
            inQuotes = true;
            i++;
            continue;
        }
        if (ch === delim) {
            row.push(field);
            field = '';
            i++;
            continue;
        }
        if (ch === '\n' || ch === '\r') {
            // handle CRLF
            if (ch === '\r' && i + 1 < length && text[i + 1] === '\n') i++;
            row.push(field);
            rows.push(row);
            row = [];
            field = '';
            i++;
            continue;
        }
        field += ch;
        i++;
    }
    // push final
    row.push(field);
    rows.push(row);
    return rows;
};

/**
 * Convert array of objects to CSV (fields order from keys param if provided).
 */
export const toCSV = (rows: Record<string, any>[], keys?: string[], delimiter = ','): string => {
    if (!rows || !rows.length) return '';
    const k = keys ?? Object.keys(rows[0]);
    const quote = (v: any) => {
        if (v === null || v === undefined) return '';
        const str = String(v);
        if (str.includes('"') || str.includes('\n') || str.includes(delimiter)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };
    const header = k.join(delimiter);
    const body = rows.map((r) => k.map((kk) => quote(r[kk] ?? '')).join(delimiter));
    return [header, ...body].join('\n');
};

/* =========================
 * Validators
 * ========================= */

/**
 * Basic email regex — good for simple validation.
 */
export const isEmail = (s: string) =>
    typeof s === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

/**
 * Basic URL check (http/https).
 */
export const isUrl = (s: string) =>
    typeof s === 'string' &&
    /^(https?:\/\/)(([a-z0-9-]+\.)+[a-z]{2,}|localhost)(:\d+)?(\/[^\s]*)?$/i.test(s);

/**
 * Basic UUID v4-ish check (loose).
 */
export const isUuidLike = (s: string) =>
    typeof s === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

/**
 * Luhn algorithm for simple credit card validation.
 */
export const luhnCheck = (s: string) => {
    const cleaned = String(s).replace(/\D/g, '');
    if (!cleaned.length) return false;
    let sum = 0;
    let flip = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let n = Number(cleaned[i]);
        if (flip) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        flip = !flip;
    }
    return sum % 10 === 0;
};

/* =========================
 * Mock data generators
 * ========================= */

export type MockProduct = {
    id: string;
    name: string;
    price: number;
    currency: string;
    sku: string;
    category: string;
    rating: number; // 0-5
    inStock: boolean;
    tags: string[];
};

/**
 * Generate a mock product for demos.
 */
export const generateMockProduct = (seed?: number): MockProduct => {
    const categories = ['tools', 'home', 'electronics', 'sports', 'books', 'garden'];
    const adjectives = ['compact', 'portable', 'durable', 'sleek', 'smart', 'eco', 'classic', 'pro'];
    const nouns = ['widget', 'charger', 'heater', 'mixer', 'sensor', 'speaker', 'lamp', 'cover'];
    const name = `${choice(adjectives) ?? 'item'} ${choice(nouns) ?? 'product'}`;
    const price = Number((rand(1, 400)).toFixed(2));
    const currency = choice(DEFAULT_CURRENCIES) ?? 'USD';
    const sku = `SKU-${randomString(6).toUpperCase()}`;
    return {
        id: `p_${randomString(8)}`,
        name,
        price,
        currency,
        sku,
        category: choice(categories) ?? 'misc',
        rating: Number((rand(0, 5)).toFixed(1)),
        inStock: Math.random() >= 0.25,
        tags: shuffle(['new', 'sale', 'popular', 'limited', 'eco']).slice(0, randInt(1, 3))
    };
};

/**
 * Generate many mock products.
 */
export const generateMockProducts = (count = 10): MockProduct[] => {
    const out: MockProduct[] = [];
    for (let i = 0; i < Math.max(0, Math.floor(count)); i++) out.push(generateMockProduct());
    return out;
};

export type SensorReading = {
    id: string;
    ts: string; // ISO
    value: number;
    unit: string;
    device: string;
    status: 'ok' | 'warn' | 'error';
};

/**
 * Generate a sequence of sensor readings (monotonic timestamps).
 */
export const generateSensorStream = (device = 'SENSOR-A', points = 50, start?: Date): SensorReading[] => {
    const s = toDate(start) ?? new Date();
    const out: SensorReading[] = [];
    let value = rand(10, 40);
    for (let i = 0; i < Math.max(0, Math.floor(points)); i++) {
        // small random walk
        value += rand(-0.5, 0.5);
        const ts = new Date(s.getTime() + i * 1000); // 1s intervals
        const status: SensorReading['status'] = Math.abs(value) > 100 ? 'error' : Math.abs(value) > 80 ? 'warn' : 'ok';
        out.push({
            id: `r_${randomString(8)}`,
            ts: ts.toISOString(),
            value: Number(value.toFixed(3)),
            unit: '°C',
            device,
            status
        });
    }
    return out;
};

/**
 * Lightweight log entry shape.
 */
export type LogEntry = {
    id: string;
    ts: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    msg: string;
    meta?: Record<string, any>;
};

/**
 * Generate mock logs for demos.
 */
export const generateMockLogs = (count = 20, start?: Date): LogEntry[] => {
    const m = ['startup', 'shutdown', 'sync', 'unexpected', 'retry', 'batch'];
    const l = ['debug', 'info', 'warn', 'error'];
    const s = toDate(start) ?? new Date();
    const out: LogEntry[] = [];
    for (let i = 0; i < Math.max(0, Math.floor(count)); i++) {
        const ts = new Date(s.getTime() + i * 1000);
        out.push({
            id: `log_${randomString(9)}`,
            ts: ts.toISOString(),
            level: choice(l) ?? 'info',
            msg: `${choice(m) ?? 'event'} ${randomString(4)}`,
            meta: { attempt: randInt(0, 4), thread: `t-${randInt(1, 8)}` }
        });
    }
    return out;
};

/**
 * Transaction shape.
 */
export type Transaction = {
    id: string;
    ts: string;
    amount: number;
    currency: string;
    status: 'pending' | 'settled' | 'failed';
    payer: string;
    payee: string;
    cardLast4?: string;
};

/**
 * Generate mock transactions with basic distributions.
 */
export const generateMockTransactions = (count = 15, start?: Date): Transaction[] => {
    const s = toDate(start) ?? new Date();
    const out: Transaction[] = [];
    const names = ['Alice', 'Bob', 'Carla', 'Dan', 'Eve', 'Frank', 'Grace', 'Hector'];
    for (let i = 0; i < Math.max(0, Math.floor(count)); i++) {
        const ts = new Date(s.getTime() + i * 60 * 1000); // minute intervals
        const amount = Number((rand(1, 1000)).toFixed(2));
        const status = Math.random() < 0.05 ? 'failed' : Math.random() < 0.15 ? 'pending' : 'settled';
        out.push({
            id: `tx_${randomString(10)}`,
            ts: ts.toISOString(),
            amount,
            currency: choice(DEFAULT_CURRENCIES) ?? 'USD',
            status,
            payer: choice(names) ?? 'User',
            payee: `${choice(names) ?? 'Merch'} Co`,
            cardLast4: `${randInt(1000, 9999)}`
        });
    }
    return out;
};

/* =========================
 * Analyzers (text and numeric)
 * ========================= */

/**
 * Basic text stats — word count, average word length, unique words, estimated reading time (wpm 200).
 */
export const textStats = (s: string) => {
    const raw = String(s ?? '');
    const words = raw.trim().length ? raw.trim().split(/\s+/) : [];
    const chars = raw.length;
    const wordCount = words.length;
    const avgWordLen = wordCount ? words.reduce((sum, w) => sum + w.length, 0) / wordCount : 0;
    const uniqueWords = new Set(words.map((w) => w.toLowerCase().replace(/[^\w]/g, '')));
    const readingTimeMin = Math.max(0.25, wordCount / 200);
    return {
        chars,
        wordCount,
        avgWordLen: Number(avgWordLen.toFixed(2)),
        unique: uniqueWords.size,
        readingMinutes: Number(readingTimeMin.toFixed(2))
    };
};

/**
 * Simple Flesch reading ease alternative (approx).
 * - Higher score = easier to read.
 */
export const readabilityScore = (s: string): number => {
    // This is a very rough heuristic using words and sentence punctuation.
    const raw = String(s ?? '').trim();
    if (!raw) return 0;
    const words = raw.split(/\s+/).length;
    const sentences = Math.max(1, (raw.match(/[.!?]+/g) || []).length);
    const syllables = raw
        .toLowerCase()
        .replace(/[^a-z\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .reduce((sum, w) => {
            // rough syllable heuristic: count vowel groups
            const groups = (w.match(/[aeiouy]+/g) || []).length;
            return sum + Math.max(1, groups);
        }, 0);
    // Flesch reading ease
    const ASL = words / sentences; // average sentence length
    const ASW = words ? syllables / words : 1; // average syllables per word
    const score = 206.835 - 1.015 * ASL - 84.6 * ASW;
    return Number(score.toFixed(2));
};

/**
 * Numeric summary for arrays of numbers.
 */
export const numericSummary = (arr: number[]) => {
    const n = arr.length;
    if (!n) return { count: 0, min: 0, max: 0, sum: 0, mean: 0, median: 0, stdev: 0 };
    const sorted = arr.slice().sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];
    const sum = arr.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const median = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
    const variance = arr.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
    const stdev = Math.sqrt(variance);
    return { count: n, min, max, sum, mean, median, stdev };
};

/* =========================
 * Color utilities
 * ========================= */

/**
 * Generate a random hex color.
 */
export const randomHexColor = (): string => {
    return '#' + randomString(6, '0123456789ABCDEF');
};

/**
 * Convert hex color to RGB object.
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    if (!hex) return null;
    const cleaned = hex.replace('#', '');
    if (![3, 6].includes(cleaned.length)) return null;
    const expand = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned;
    const r = parseInt(expand.slice(0, 2), 16);
    const g = parseInt(expand.slice(2, 4), 16);
    const b = parseInt(expand.slice(4, 6), 16);
    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
    return { r, g, b };
};

/**
 * Convert rgb to hex.
 */
export const rgbToHex = (r: number, g: number, b: number) => {
    const p = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    return `#${p(r)}${p(g)}${p(b)}`.toUpperCase();
};

/**
 * Relative luminance as defined for WCAG.
 */
export const luminance = (hex: string): number | null => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    const toLin = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    const r = toLin(rgb.r);
    const g = toLin(rgb.g);
    const b = toLin(rgb.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Contrast ratio between two hex colors.
 */
export const contrastRatio = (hex1: string, hex2: string): number | null => {
    const l1 = luminance(hex1);
    const l2 = luminance(hex2);
    if (l1 === null || l2 === null) return null;
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
};

/**
 * Very small check if a color is "light".
 */
export const isLightColor = (hex: string): boolean => {
    const rgb = hexToRgb(hex);
    if (!rgb) return true;
    // YIQ quick approximation
    const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return yiq >= 128;
};

/* =========================
 * Small functional utilities
 * ========================= */

/**
 * Debounce returns a debounced pure wrapper for a synchronous function.
 * The returned function has a cancel method. Implementation uses setTimeout.
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, wait = 100) => {
    let timer: any = null;
    const debounced = function (this: any, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, wait);
    };
    (debounced as any).cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    };
    return debounced as unknown as T & { cancel: () => void };
};

/**
 * Throttle — ensures fn is called at most once per interval.
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, interval = 100) => {
    let last = 0;
    let timeout: any = null;
    return function (this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const remaining = interval - (now - last);
        if (remaining <= 0) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            last = now;
            fn.apply(this, args);
        } else if (!timeout) {
            timeout = setTimeout(() => {
                last = Date.now();
                timeout = null;
                fn.apply(this, args);
            }, remaining);
        }
    } as T;
};

/**
 * Memoize simple pure functions of 1 or more primitive args (stringify cache key).
 */
export const memoize = <F extends (...args: any[]) => any>(fn: F, maxSize = 1000) => {
    const cache = new Map<string, any>();
    return function (...args: Parameters<F>) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const res = fn(...args);
        cache.set(key, res);
        if (cache.size > maxSize) {
            // simple eviction oldest
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        return res;
    } as F;
};

/**
 * Once — run a function once and cache its result.
 */
export const once = <F extends (...args: any[]) => any>(fn: F) => {
    let done = false;
    let res: any;
    return function (...args: Parameters<F>) {
        if (!done) {
            done = true;
            res = fn(...args);
        }
        return res;
    } as F;
};

/* =========================
 * Utility converters & helpers
 * ========================= */

/**
 * Convert bytes to human string (SI).
 */
export const bytesToHuman = (bytes: number, decimals = 2): string => {
    if (!Number.isFinite(bytes)) return '0 B';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(decimals)} ${sizes[i] ?? 'B'}`;
};

/**
 * Simple deep clone (JSON safe).
 */
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge two plain objects (shallow).
 */
export const shallowMerge = <T extends Record<string, any>, U extends Record<string, any>>(a: T, b: U): T & U => {
    return Object.assign({}, a, b) as T & U;
};

/* =========================
 * Small analysis helpers (demo)
 * ========================= */

/**
 * Find top N frequent words from text (case insensitive, stripped of non-word chars).
 */
export const topWords = (s: string, n = 5): { word: string; count: number }[] => {
    const cleaned = s.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleaned.split(/\s+/).filter(Boolean);
    const map = new Map<string, number>();
    for (const w of words) map.set(w, (map.get(w) ?? 0) + 1);
    const arr = Array.from(map.entries()).map(([word, count]) => ({ word, count }));
    arr.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
    return arr.slice(0, n);
};

/**
 * Detect probable delimiter for small text tables.
 */
export const detectSimpleDelimiter = (s: string): ',' | '|' | '\t' | ';' => {
    const stats: Record<string, number> = { ',': 0, '|': 0, '\t': 0, ';': 0 };
    const lines = s.split(/\r\n|\n|\r/).filter(Boolean);
    for (const l of lines.slice(0, 5)) {
        for (const d of Object.keys(stats)) {
            stats[d] += (l.split(d).length - 1);
        }
    }
    let best: string = ',';
    let max = -1;
    for (const k of Object.keys(stats)) {
        if (stats[k] > max) {
            max = stats[k];
            best = k;
        }
    }
    return (best as any) ?? ',';
};

/* =========================
 * Quick demo algorithms
 * ========================= */

/**
 * Simple sliding window average for numeric array.
 */
export const slidingAverage = (arr: number[], window = 3): number[] => {
    const n = arr.length;
    if (!n || window <= 1) return arr.slice();
    const out: number[] = [];
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += arr[i];
        if (i >= window) sum -= arr[i - window];
        if (i >= window - 1) out.push(sum / window);
    }
    return out;
};

/**
 * Median filter of size window.
 */
export const medianFilter = (arr: number[], window = 3): number[] => {
    if (!arr.length || window <= 1) return arr.slice();
    const out: number[] = [];
    const half = Math.floor(window / 2);
    for (let i = 0; i < arr.length; i++) {
        const start = Math.max(0, i - half);
        const end = Math.min(arr.length, i + half + 1);
        const slice = arr.slice(start, end).sort((a, b) => a - b);
        out.push(slice[Math.floor(slice.length / 2)]);
    }
    return out;
};

/**
 * Simple kth smallest element (quickselect).
 */
export const quickSelect = (arr: number[], k: number): number | null => {
    const n = arr.length;
    if (!n || k < 0 || k >= n) return null;
    const a = arr.slice();
    const select = (left: number, right: number, index: number): number => {
        if (left === right) return a[left];
        const pivotIndex = Math.floor((left + right) / 2);
        const pivot = a[pivotIndex];
        // partition
        let l = left, r = right;
        while (l <= r) {
            while (a[l] < pivot) l++;
            while (a[r] > pivot) r--;
            if (l <= r) {
                const tmp = a[l];
                a[l] = a[r];
                a[r] = tmp;
                l++;
                r--;
            }
        }
        if (index <= r) return select(left, r, index);
        if (index >= l) return select(l, right, index);
        return a[index];
    };
    return select(0, n - 1, k);
};

/* =========================
 * Lightweight validators for demo
 * ========================= */

/**
 * Validate basic phone number (US-ish).
 */
export const isUSPhone = (s: string) => {
    const cleaned = s.replace(/[^\d]/g, '');
    return cleaned.length === 10 || cleaned.length === 11 && cleaned.startsWith('1');
};

/**
 * Simple credit card data mask for display.
 */
export const maskCard = (cardNumber: string, visible = 4): string => {
    const clean = cardNumber.replace(/\s+/g, '');
    const tail = clean.slice(-visible);
    if (!tail) return '*'.repeat(visible);
    return `${'*'.repeat(Math.max(0, clean.length - visible))}${tail}`;
};

/* =========================
 * Small examples / lightweight demos
 * ========================= */

/**
 * Simple "simulate traffic" function generating events per second using poisson approx.
 * This is a purely local generator.
 */
export const simulateTraffic = (seconds = 10, avgPerSecond = 5) => {
    const out: { ts: string; count: number }[] = [];
    for (let t = 0; t < seconds; t++) {
        // Poisson-ish: draw from Poisson with lambda=avgPerSecond using Knuth algorithm
        let L = Math.exp(-avgPerSecond);
        let k = 0;
        let p = 1;
        while (p > L) {
            k++;
            p *= Math.random();
        }
        out.push({ ts: new Date(Date.now() + t * 1000).toISOString(), count: k - 1 });
    }
    return out;
};

/* =========================
 * Misc helpers to keep around
 * ========================= */

/**
 * Safe number parse that returns defaultVal on failure.
 */
export const safeParseFloat = (s: unknown, defaultVal = 0): number => {
    const n = typeof s === 'number' ? s : Number(s);
    return Number.isFinite(n) ? n : defaultVal;
};

/**
 * Threshold calculator: given numbers returns min/max/avg and suggested lower/upper bounds
 * optionally scaled outward by margin.
 */
export const suggestBounds = (arr: number[], margin = 0.1) => {
    const s = numericSummary(arr);
    if (!s.count) return { min: 0, max: 0, avg: 0, lower: 0, upper: 0 };
    const span = s.max - s.min || Math.abs(s.max) || 1;
    const lower = s.min - span * margin;
    const upper = s.max + span * margin;
    return { min: s.min, max: s.max, avg: s.mean, lower, upper };
};

/* =========================
 * Exports enumerated for convenience (keeps file self-describing)
 * ========================= */

export const toolkitIndex = {
    // basic
    CHAR_WORDS,
    DEFAULT_CURRENCIES,
    // strings
    titleCase,
    snakeCase,
    kebabCase,
    camelCase,
    slugify,
    truncate,
    repeat,
    joinWithAnd,
    // random
    randInt,
    rand,
    choice,
    randomString,
    // dates
    toDate,
    formatDate,
    daysBetween,
    addDays,
    startOfDay,
    endOfDay,
    formatDuration,
    // arrays
    shuffle,
    chunk,
    unique,
    rotate,
    weightedRandom,
    reservoirSample,
    // math
    gcd,
    lcm,
    factorial,
    combinations,
    fibonacci,
    // data structures
    RingBuffer,
    // CSV
    detectDelimiter,
    parseCSV,
    toCSV,
    // validators
    isEmail,
    isUrl,
    isUuidLike,
    luhnCheck,
    // mocks
    generateMockProduct,
    generateMockProducts,
    generateSensorStream,
    generateMockLogs,
    generateMockTransactions,
    // analysis
    textStats,
    readabilityScore,
    numericSummary,
    // colors
    randomHexColor,
    hexToRgb,
    rgbToHex,
    luminance,
    contrastRatio,
    isLightColor,
    // functional
    debounce,
    throttle,
    memoize,
    once,
    // converters
    bytesToHuman,
    deepClone,
    shallowMerge,
    // algorithms
    slidingAverage,
    medianFilter,
    quickSelect,
    // misc
    topWords,
    detectSimpleDelimiter,
    simulateTraffic,
    safeParseFloat,
    suggestBounds
};