/**
 * updateForecastToolkit.ts
 *
 * Self-contained time-series toolkit for demo forecasting, smoothing,
 * anomaly detection and synthetic data generation.
 * No imports and no side-effects — safe to keep unused until integrated.
 *
 * Designed to be independent of the main application. Includes:
 *  - time-series normalization & resampling
 *  - simple forecasting models (naive, drift, linear regression, exponential smoothing)
 *  - Holt's and Holt-Winters variants
 *  - anomaly detection (z-score, IQR, MAD)
 *  - basic forecast evaluation metrics (MAE, RMSE, MAPE)
 *  - autocorrelation / seasonality estimation
 *  - synthetic generator (trend + seasonality + noise) with optional seeded RNG
 *
 * Usage: purely local helpers for experimenting with small time-series tasks.
 */

export type TimePoint = { ts: number; value: number }; // ts in ms epoch
export type Series = TimePoint[];

/* =========================
 * Small deterministic RNG (LCG) for repeatable mock generation
 * ========================= */

export const seededRng = (seed = Date.now()) => {
    // simple LCG (not cryptographically strong) — deterministic for demos
    let s = Math.floor(seed) >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
};

/* =========================
 * Converters / normalization
 * ========================= */

export const toMillis = (t: number | string | Date): number =>
    t instanceof Date ? t.getTime() : typeof t === 'string' ? new Date(t).getTime() : t;

export const normalizeSeries = (raw: Array<{ ts: Date | number | string; value: number }>): Series => {
    const out: Series = raw
        .map((p) => ({ ts: toMillis(p.ts), value: Number(p.value) }))
        .filter((p) => Number.isFinite(p.ts) && Number.isFinite(p.value));
    out.sort((a, b) => a.ts - b.ts);
    return out;
};

export const cloneSeries = (s: Series): Series => s.map((p) => ({ ts: p.ts, value: p.value }));

/* =========================
 * Resampling and aggregation
 * ========================= */

export type Aggregate = 'mean' | 'sum' | 'first' | 'last' | 'median';

const medianOf = (arr: number[]): number => {
    const a = arr.slice().sort((x, y) => x - y);
    if (!a.length) return 0;
    const mid = Math.floor((a.length - 1) / 2);
    return a.length % 2 ? a[mid] : (a[mid] + a[mid + 1]) / 2;
};

/**
 * Resample a series to a fixed interval (ms). Aggregation by window:
 * - mean | sum | first | last | median
 * Output's ts represent window start.
 */
export const resampleSeries = (series: Series, intervalMs: number, agg: Aggregate = 'mean', alignToStart = true): Series => {
    if (!series.length || intervalMs <= 0) return [];
    const src = cloneSeries(series);
    const start = alignToStart ? Math.floor(src[0].ts / intervalMs) * intervalMs : src[0].ts;
    const end = src[src.length - 1].ts;
    const out: Series = [];
    let i = 0;
    for (let t = start; t <= end; t += intervalMs) {
        const bucket: number[] = [];
        while (i < src.length && src[i].ts < t + intervalMs) {
            if (src[i].ts >= t) bucket.push(src[i].value);
            i++;
        }
        if (!bucket.length) {
            // leave as gap or use last known value — here we skip
            continue;
        }
        let v = 0;
        switch (agg) {
            case 'mean':
                v = bucket.reduce((s, x) => s + x, 0) / bucket.length;
                break;
            case 'sum':
                v = bucket.reduce((s, x) => s + x, 0);
                break;
            case 'first':
                v = bucket[0];
                break;
            case 'last':
                v = bucket[bucket.length - 1];
                break;
            case 'median':
                v = medianOf(bucket);
                break;
        }
        out.push({ ts: t, value: v });
    }
    return out;
};

/* =========================
 * Smoothing & filters
 * ========================= */

/** Simple moving average (window size in points) */
export const simpleMovingAverage = (values: number[], window = 3): number[] => {
    if (!values.length) return [];
    const w = Math.max(1, Math.floor(window));
    const out: number[] = [];
    let sum = 0;
    for (let i = 0; i < values.length; i++) {
        sum += values[i];
        if (i >= w) sum -= values[i - w];
        if (i >= w - 1) out.push(sum / w);
    }
    return out;
};

/**
 * Exponential moving average (alpha in (0,1]).
 * Returns array aligned with input; undefined for indices before seed.
 */
export const exponentialMovingAverage = (values: number[], alpha = 0.2): number[] => {
    if (!values.length) return [];
    const a = Math.max(0, Math.min(1, alpha));
    const out: number[] = [];
    let prev = values[0];
    out.push(prev);
    for (let i = 1; i < values.length; i++) {
        prev = a * values[i] + (1 - a) * prev;
        out.push(prev);
    }
    return out;
};

/* =========================
 * Holt's linear (double exp smoothing)
 * ========================= */

/**
 * Holt's linear method (additive trend).
 * alpha — level smoothing, beta — trend smoothing.
 * Returns fitted series and forecasts for steps.
 */
export const holtLinear = (values: number[], alpha = 0.3, beta = 0.1, forecastSteps = 0) => {
    const n = values.length;
    if (!n) return { fitted: [] as number[], forecast: [] as number[] };
    const a = Math.max(0, Math.min(1, alpha));
    const b = Math.max(0, Math.min(1, beta));

    // init level and trend using first two points
    let level = values[0];
    let trend = n > 1 ? values[1] - values[0] : 0;
    const fitted: number[] = [level];

    for (let t = 1; t < n; t++) {
        const value = values[t];
        const prevLevel = level;
        level = a * value + (1 - a) * (level + trend);
        trend = b * (level - prevLevel) + (1 - b) * trend;
        fitted.push(level + trend);
    }
    const forecast: number[] = [];
    for (let k = 1; k <= forecastSteps; k++) {
        forecast.push(level + k * trend);
    }
    return { fitted, forecast };
};

/* =========================
 * Holt-Winters (multiplicative & additive)
 * ========================= */

/**
 * Holt-Winters additive seasonality.
 * seasonLen must be >= 2 and not exceed series length.
 * alpha, beta, gamma smoothing params in [0,1].
 */
export const holtWintersAdditive = (
    values: number[],
    seasonLen: number,
    alpha = 0.2,
    beta = 0.01,
    gamma = 0.01,
    forecastSteps = 0,
    maxIters = 200
) => {
    const n = values.length;
    if (!n || seasonLen < 2 || seasonLen > n) return { fitted: [], forecast: [] };
    const A = Math.max(0, Math.min(1, alpha));
    const B = Math.max(0, Math.min(1, beta));
    const G = Math.max(0, Math.min(1, gamma));

    // initial level = average of first season
    const season0 = values.slice(0, seasonLen);
    const level0 = season0.reduce((s, v) => s + v, 0) / seasonLen;
    // initial seasonal factors: value - level
    const seasonals = new Array(seasonLen).fill(0).map((_, i) => values[i] - level0);

    let level = level0;
    let trend = 0;
    const fitted: number[] = [];

    for (let t = 0; t < n; t++) {
        const sIdx = t % seasonLen;
        const val = values[t];
        const lastLevel = level;
        const lastSeason = seasonals[sIdx];
        // level
        level = A * (val - lastSeason) + (1 - A) * (level + trend);
        // trend
        trend = B * (level - lastLevel) + (1 - B) * trend;
        // seasonal
        seasonals[sIdx] = G * (val - level) + (1 - G) * lastSeason;
        fitted.push(level + trend + seasonals[sIdx]);
    }

    // forecast
    const forecast: number[] = [];
    for (let k = 1; k <= forecastSteps; k++) {
        const m = k;
        const sIdx = (n + k - 1) % seasonLen;
        forecast.push(level + m * trend + seasonals[sIdx]);
    }

    return { fitted, forecast };
};

/* =========================
 * Simple regression-based forecasting
 * ========================= */

/** Fit least-squares line on sequence values indexed 0..n-1 */
export const linearRegression = (values: number[]) => {
    const n = values.length;
    if (n === 0) return { slope: 0, intercept: 0, r2: 0 };
    const xs = n === 1 ? [0] : Array.from({ length: n }, (_, i) => i);
    const meanX = (n - 1) / 2;
    const meanY = values.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n; i++) {
        num += (xs[i] - meanX) * (values[i] - meanY);
        den += (xs[i] - meanX) ** 2;
    }
    const slope = den === 0 ? 0 : num / den;
    const intercept = meanY - slope * meanX;
    // R^2
    let ssRes = 0;
    let ssTot = 0;
    for (let i = 0; i < n; i++) {
        const pred = slope * xs[i] + intercept;
        ssRes += (values[i] - pred) ** 2;
        ssTot += (values[i] - meanY) ** 2;
    }
    const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;
    return { slope, intercept, r2 };
};

/** Forecast using linear regression (simple) */
export const linearForecast = (values: number[], steps = 1) => {
    const { slope, intercept } = linearRegression(values);
    const n = values.length;
    const out: number[] = [];
    for (let k = 1; k <= steps; k++) {
        out.push(slope * (n - 1 + k) + intercept);
    }
    return out;
};

/* =========================
 * Forecast baselines & helpers
 * ========================= */

export const naiveForecast = (values: number[], steps = 1) => {
    if (!values.length) return Array(steps).fill(0);
    const last = values[values.length - 1];
    return Array(steps).fill(last);
};

export const meanForecast = (values: number[], steps = 1) => {
    if (!values.length) return Array(steps).fill(0);
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    return Array(steps).fill(mean);
};

export const driftForecast = (values: number[], steps = 1) => {
    const n = values.length;
    if (n < 2) return naiveForecast(values, steps);
    const slope = (values[n - 1] - values[0]) / (n - 1);
    return Array.from({ length: steps }, (_, k) => values[n - 1] + slope * (k + 1));
};

/* =========================
 * Forecast evaluation
 * ========================= */

export const mae = (actual: number[], predicted: number[]) => {
    const n = Math.min(actual.length, predicted.length);
    if (!n) return 0;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += Math.abs(actual[i] - predicted[i]);
    return sum / n;
};

export const rmse = (actual: number[], predicted: number[]) => {
    const n = Math.min(actual.length, predicted.length);
    if (!n) return 0;
    let sum = 0;
    for (let i = 0; i < n; i++) sum += (actual[i] - predicted[i]) ** 2;
    return Math.sqrt(sum / n);
};

export const mape = (actual: number[], predicted: number[]) => {
    const n = Math.min(actual.length, predicted.length);
    if (!n) return 0;
    let sum = 0;
    for (let i = 0; i < n; i++) {
        if (actual[i] === 0) continue;
        sum += Math.abs((actual[i] - predicted[i]) / actual[i]);
    }
    return (sum / n) * 100;
};

/* =========================
 * Autocorrelation & seasonality
 * ========================= */

/** Autocorrelation for lag (pearson corr between original and lagged) */
export const autocorrelation = (values: number[], lag: number): number => {
    const n = values.length;
    if (!n || lag <= 0 || lag >= n) return 0;
    const mean = values.reduce((s, v) => s + v, 0) / n;
    let num = 0;
    let den = 0;
    for (let i = 0; i < n - lag; i++) {
        num += (values[i] - mean) * (values[i + lag] - mean);
    }
    for (let i = 0; i < n; i++) {
        den += (values[i] - mean) ** 2;
    }
    if (den === 0) return 0;
    return num / den;
};

/** Autocorrelation function for lags 1..maxLag */
export const acf = (values: number[], maxLag = 30): number[] => {
    const out: number[] = [];
    const m = Math.min(maxLag, values.length - 1);
    for (let lag = 1; lag <= m; lag++) out.push(autocorrelation(values, lag));
    return out;
};

/** Estimate strongest seasonality (lag) in range [minLag, maxLag] */
export const estimateSeasonality = (values: number[], minLag = 2, maxLag = 50): { lag: number; strength: number } => {
    const m = Math.min(maxLag, values.length - 1);
    let bestLag = 0;
    let best = -Infinity;
    for (let lag = Math.max(minLag, 1); lag <= m; lag++) {
        const corr = autocorrelation(values, lag);
        if (corr > best) {
            best = corr;
            bestLag = lag;
        }
    }
    return { lag: bestLag, strength: Number(best.toFixed(4)) };
};

/* =========================
 * Anomaly detection
 * ========================= */

/** Z-score anomalies — returns indices of points with |z| >= threshold */
export const detectZScore = (values: number[], threshold = 3) => {
    const n = values.length;
    if (!n) return [];
    const mean = values.reduce((s, v) => s + v, 0) / n;
    const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    const stdev = Math.sqrt(variance);
    if (stdev === 0) return [];
    const out: number[] = [];
    for (let i = 0; i < n; i++) {
        const z = (values[i] - mean) / stdev;
        if (Math.abs(z) >= threshold) out.push(i);
    }
    return out;
};

/** IQR-based anomalies: points outside [Q1 - k*IQR, Q3 + k*IQR] */
export const detectIQR = (values: number[], k = 1.5) => {
    if (!values.length) return [];
    const sorted = values.slice().sort((a, b) => a - b);
    const q1 = sorted[Math.floor((sorted.length - 1) * 0.25)];
    const q3 = sorted[Math.floor((sorted.length - 1) * 0.75)];
    const iqr = q3 - q1;
    const low = q1 - k * iqr;
    const high = q3 + k * iqr;
    const out: number[] = [];
    for (let i = 0; i < values.length; i++) if (values[i] < low || values[i] > high) out.push(i);
    return out;
};

/** MAD (median absolute deviation) anomalies */
export const detectMAD = (values: number[], threshold = 3) => {
    if (!values.length) return [];
    const med = medianOf(values);
    const devs = values.map((v) => Math.abs(v - med));
    const mad = medianOf(devs);
    if (mad === 0) return [];
    const out: number[] = [];
    for (let i = 0; i < values.length; i++) {
        const score = Math.abs(values[i] - med) / mad;
        if (score >= threshold) out.push(i);
    }
    return out;
};

/* =========================
 * Synthetic series generator
 * ========================= */

export type SyntheticOpts = {
    length?: number;
    freqMs?: number;
    startTime?: number | Date;
    seed?: number;
    trend?: number; // incremental additive per point
    amplitude?: number;
    period?: number; // in points
    noise?: number; // sd
    drift?: number; // multiplier on time
    baseline?: number;
};

export const generateSyntheticSeries = (opts?: SyntheticOpts): Series => {
    const {
        length = 200,
        freqMs = 1000,
        startTime = Date.now(),
        seed,
        trend = 0,
        amplitude = 1,
        period = 50,
        noise = 0.5,
        drift = 0,
        baseline = 0
    } = opts ?? {};
    const rng = seed !== undefined ? seededRng(seed) : Math.random;
    const start = toMillis(startTime as any);
    const out: Series = [];
    let driftAccum = 0;
    for (let i = 0; i < Math.max(0, Math.floor(length)); i++) {
        // sin season + linear trend + noise + slight drift
        const seasonal = amplitude * Math.sin((2 * Math.PI * i) / Math.max(1, period));
        driftAccum += drift;
        const noiseTerm = (rng() - 0.5) * 2 * noise;
        const value = baseline + seasonal + trend * i + driftAccum + noiseTerm;
        out.push({ ts: start + i * freqMs, value: Number(Number(value).toFixed(6)) });
    }
    return out;
};

/* =========================
 * Train/test split and helpers
 * ========================= */

export const splitSeries = (series: Series, testFractionOrCount: number) => {
    const n = series.length;
    if (!n) return { train: [], test: [] as Series };
    if (testFractionOrCount <= 1) {
        const cnt = Math.max(0, Math.floor(n * testFractionOrCount));
        return { train: series.slice(0, n - cnt), test: series.slice(n - cnt) };
    } else {
        const cnt = Math.min(n, Math.max(0, Math.floor(testFractionOrCount)));
        return { train: series.slice(0, n - cnt), test: series.slice(n - cnt) };
    }
};

/* =========================
 * Helpers & exports index
 * ========================= */

export const seriesValues = (s: Series): number[] => s.map((p) => p.value);
export const seriesTimestamps = (s: Series): number[] => s.map((p) => p.ts);

/* =========================
 * Module index
 * ========================= */

export const forecastToolkitIndex = {
    seededRng,
    toMillis,
    normalizeSeries,
    cloneSeries,
    resampleSeries,
    simpleMovingAverage,
    exponentialMovingAverage,
    holtLinear,
    holtWintersAdditive,
    linearRegression,
    linearForecast,
    naiveForecast,
    meanForecast,
    driftForecast,
    mae,
    rmse,
    mape,
    autocorrelation,
    acf,
    estimateSeasonality,
    detectZScore,
    detectIQR,
    detectMAD,
    generateSyntheticSeries,
    splitSeries,
    seriesValues,
    seriesTimestamps
};