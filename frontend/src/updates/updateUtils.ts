/**
 * updateUtils.ts
 *
 * Standalone, isolated utility helpers for development demos.
 * No imports, no side-effects — safe to keep unused until integrated.
 * Includes math helpers, formatters, date utilities, mock-data generator and basic validators.
 */

export const generateId = (prefix = 'id', length = 8): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${prefix}_${id}`;
};

export const clamp = (value: number, min: number, max: number): number =>
    Math.max(min, Math.min(max, value));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const average = (nums: number[]): number =>
    nums.length ? nums.reduce((s, n) => s + n, 0) / nums.length : 0;

export const median = (nums: number[]): number => {
    if (!nums.length) return 0;
    const s = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
};

export const isPrime = (n: number): boolean => {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
};

export const formatBytes = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = bytes / Math.pow(k, i);
    return `${value.toFixed(decimals)} ${sizes[i] ?? 'B'}`;
};

export const formatPercent = (value: number, total = 1, decimals = 1): string => {
    const pct = total === 0 ? 0 : (value / total) * 100;
    return `${pct.toFixed(decimals)}%`;
};

export const relativeTime = (input: Date | number | string, now = new Date()): string => {
    const date = input instanceof Date ? input : new Date(input);
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const abs = Math.abs(diffSeconds);

    const units = [
        { label: 'year', s: 60 * 60 * 24 * 365 },
        { label: 'mo', s: 60 * 60 * 24 * 30 },
        { label: 'day', s: 60 * 60 * 24 },
        { label: 'hour', s: 60 * 60 },
        { label: 'min', s: 60 },
        { label: 'sec', s: 1 }
    ];

    for (const u of units) {
        const value = Math.floor(abs / u.s);
        if (value >= 1) {
            const label = value > 1 ? `${u.label}s` : u.label;
            return diffSeconds > 0 ? `${value} ${label} ago` : `in ${value} ${label}`;
        }
    }
    return 'just now';
};

export const startOfDay = (input: Date | number | string): Date => {
    const d = new Date(input);
    d.setHours(0, 0, 0, 0);
    return d;
};

export const endOfDay = (input: Date | number | string): Date => {
    const d = new Date(input);
    d.setHours(23, 59, 59, 999);
    return d;
};

export const randomBetween = (min: number, max: number, integer = true): number =>
    integer ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;

export const isValidHexColor = (hex: string): boolean => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex);

export const parseQueryString = (qs: string): Record<string, string | string[]> => {
    const raw = qs.startsWith('?') ? qs.slice(1) : qs;
    if (!raw) return {};
    const parts = raw.split('&');
    const out: Record<string, string | string[]> = {};
    for (const p of parts) {
        if (!p) continue;
        const [k, v = ''] = p.split('=');
        const key = decodeURIComponent(k);
        const value = decodeURIComponent(v);
        if (out[key]) {
            const cur = out[key];
            out[key] = Array.isArray(cur) ? [...cur, value] : [cur as string, value];
        } else {
            out[key] = value;
        }
    }
    return out;
};

export const generateMockUsers = (count = 3) => {
    const first = ['Ari', 'Sam', 'Jae', 'Rin', 'Kai', 'Noa', 'Eli', 'Tess'];
    const last = ['Stone', 'Miller', 'Lane', 'Khan', 'Reed', 'Cole'];
    const domains = ['example.com', 'demo.test', 'local.dev'];

    const users: { id: string; name: string; email: string }[] = [];
    for (let i = 0; i < Math.max(0, Math.floor(count)); i++) {
        const id = generateId('u', 6);
        const name = `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
        const email = `${name.toLowerCase().replace(/\s+/g, '.')}@${domains[Math.floor(Math.random() * domains.length)]}`;
        users.push({ id, name, email });
    }
    return users;
};