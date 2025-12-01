/**
 * updateGraphToolkit.ts
 *
 * Standalone graph algorithms and network modeling helpers for demos and experiments.
 * No imports, no side-effects — safe to keep unused until integrated.
 *
 * Includes:
 *  - Graph container (directed/undirected)
 *  - BFS / DFS / path reconstruction
 *  - Dijkstra & Bellman-Ford shortest paths
 *  - Topological sort, cycle detection
 *  - Tarjan strongly connected components
 *  - Kruskal & Prim minimum spanning trees
 *  - Random graph generators and small analysis utilities
 *
 * All functions are self-contained and do not interact with the main application.
 */

export type NodeId = string | number;

const toKey = (id: NodeId) => String(id);

/* =========================
 * Minimal binary min-heap for dijkstra/prim
 * ========================= */
type HeapItem = { key: string; priority: number };

class MinHeap {
    private data: HeapItem[] = [];

    size() {
        return this.data.length;
    }
    isEmpty() {
        return this.data.length === 0;
    }
    private parent(i: number) { return Math.floor((i - 1) / 2); }
    private left(i: number) { return 2 * i + 1; }
    private right(i: number) { return 2 * i + 2; }

    push(item: HeapItem) {
        this.data.push(item);
        let i = this.data.length - 1;
        while (i > 0 && this.data[this.parent(i)].priority > this.data[i].priority) {
            [this.data[this.parent(i)], this.data[i]] = [this.data[i], this.data[this.parent(i)]];
            i = this.parent(i);
        }
    }

    pop(): HeapItem | undefined {
        if (!this.data.length) return undefined;
        const min = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this.heapify(0);
        }
        return min;
    }

    private heapify(i: number) {
        const l = this.left(i), r = this.right(i);
        let smallest = i;
        if (l < this.data.length && this.data[l].priority < this.data[smallest].priority) smallest = l;
        if (r < this.data.length && this.data[r].priority < this.data[smallest].priority) smallest = r;
        if (smallest !== i) {
            [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
            this.heapify(smallest);
        }
    }
}

/* =========================
 * Graph container
 * ========================= */

export class Graph {
    private adj: Map<string, Map<string, number>> = new Map();
    constructor(public directed = false) {}

    clone(): Graph {
        const g = new Graph(this.directed);
        for (const [u, m] of this.adj.entries()) {
            const mm = new Map<string, number>();
            for (const [v, w] of m.entries()) mm.set(v, w);
            g.adj.set(u, mm);
        }
        return g;
    }

    addNode(id: NodeId) {
        const k = toKey(id);
        if (!this.adj.has(k)) this.adj.set(k, new Map());
    }

    hasNode(id: NodeId) {
        return this.adj.has(toKey(id));
    }

    nodes(): string[] {
        return Array.from(this.adj.keys());
    }

    addEdge(from: NodeId, to: NodeId, weight = 1) {
        const u = toKey(from), v = toKey(to);
        if (!this.adj.has(u)) this.addNode(u);
        if (!this.adj.has(v)) this.addNode(v);
        this.adj.get(u)!.set(v, weight);
        if (!this.directed) this.adj.get(v)!.set(u, weight);
    }

    removeEdge(from: NodeId, to: NodeId) {
        const u = toKey(from), v = toKey(to);
        this.adj.get(u)?.delete(v);
        if (!this.directed) this.adj.get(v)?.delete(u);
    }

    getWeight(from: NodeId, to: NodeId): number | null {
        const u = toKey(from), v = toKey(to);
        const w = this.adj.get(u)?.get(v);
        return w === undefined ? null : w;
    }

    neighbors(id: NodeId): { id: string; weight: number }[] {
        const k = toKey(id);
        const m = this.adj.get(k);
        if (!m) return [];
        const out: { id: string; weight: number }[] = [];
        for (const [v, w] of m.entries()) out.push({ id: v, weight: w });
        return out;
    }

    edges(): { from: string; to: string; weight: number }[] {
        const out: { from: string; to: string; weight: number }[] = [];
        for (const [u, map] of this.adj.entries()) {
            for (const [v, w] of map.entries()) {
                if (!this.directed && u > v) continue; // avoid duplicates in undirected graph
                out.push({ from: u, to: v, weight: w });
            }
        }
        return out;
    }

    degree(id: NodeId) {
        return this.adj.get(toKey(id))?.size ?? 0;
    }

    inDegree(id: NodeId) {
        const k = toKey(id);
        let count = 0;
        for (const [u, m] of this.adj.entries()) {
            if (m.has(k)) count++;
        }
        return count;
    }

    isEmpty() {
        return this.adj.size === 0;
    }
}

/* =========================
 * Basic traversal: BFS / DFS
 * ========================= */

/**
 * Breadth-first search from start node.
 * Returns visit order and parent/distance maps.
 */
export const bfs = (g: Graph, start: NodeId) => {
    const s = toKey(start);
    if (!g.hasNode(s)) return { order: [], parent: new Map<string, string | null>(), distance: new Map<string, number>() };
    const q: string[] = [s];
    const parent = new Map<string, string | null>();
    const dist = new Map<string, number>();
    parent.set(s, null);
    dist.set(s, 0);
    const order: string[] = [];
    while (q.length) {
        const u = q.shift()!;
        order.push(u);
        for (const nb of g.neighbors(u)) {
            const v = nb.id;
            if (!dist.has(v)) {
                parent.set(v, u);
                dist.set(v, (dist.get(u) ?? 0) + 1);
                q.push(v);
            }
        }
    }
    return { order, parent, distance: dist };
};

/**
 * Depth-first traversal (iterative).
 * Returns preorder and postorder listing.
 */
export const dfs = (g: Graph, start?: NodeId) => {
    const nodes = start ? [toKey(start)] : g.nodes();
    const visited = new Set<string>();
    const pre: string[] = [];
    const post: string[] = [];
    const stack: Array<{ node: string; iter: Iterator<string> | null }> = [];

    for (const root of nodes) {
        if (visited.has(root)) continue;
        stack.push({ node: root, iter: null });
        while (stack.length) {
            const top = stack[stack.length - 1];
            const u = top.node;
            if (!visited.has(u)) {
                visited.add(u);
                pre.push(u);
                top.iter = (function* (it) { for (const n of it) yield n; })(g.neighbors(u).map(n => n.id));
            }
            const next = top.iter!.next();
            if (!next.done) {
                const v = next.value;
                if (!visited.has(v)) stack.push({ node: v, iter: null });
            } else {
                post.push(u);
                stack.pop();
            }
        }
    }

    return { pre, post };
};

/* =========================
 * Path helpers
 * ========================= */

export const reconstructPath = (parent: Map<string, string | null>, from: NodeId, to: NodeId): string[] => {
    const t = toKey(to);
    const f = toKey(from);
    if (!parent.has(t)) return [];
    const path: string[] = [];
    let cur: string | null = t;
    while (cur !== null && cur !== undefined) {
        path.push(cur);
        if (cur === f) break;
        cur = parent.get(cur) ?? null;
    }
    return path.reverse();
};

/* =========================
 * Dijkstra shortest path (non-negative weights)
 * ========================= */

export const dijkstra = (g: Graph, source: NodeId) => {
    const s = toKey(source);
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    for (const n of g.nodes()) {
        dist.set(n, Infinity);
        prev.set(n, null);
    }
    if (!g.hasNode(s)) return { dist, prev };
    dist.set(s, 0);
    const heap = new MinHeap();
    heap.push({ key: s, priority: 0 });
    const visited = new Set<string>();
    while (!heap.isEmpty()) {
        const item = heap.pop()!;
        const u = item.key;
        if (visited.has(u)) continue;
        visited.add(u);
        const dU = dist.get(u) ?? Infinity;
        for (const nb of g.neighbors(u)) {
            const v = nb.id;
            const w = nb.weight;
            const alt = dU + w;
            if (alt < (dist.get(v) ?? Infinity)) {
                dist.set(v, alt);
                prev.set(v, u);
                heap.push({ key: v, priority: alt });
            }
        }
    }
    return { dist, prev };
};

/* =========================
 * Bellman-Ford (handles negative weights and detects negative cycles)
 * ========================= */

export const bellmanFord = (g: Graph, source: NodeId) => {
    const nodes = g.nodes();
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    for (const n of nodes) dist.set(n, Infinity), prev.set(n, null);
    const s = toKey(source);
    if (!g.hasNode(s)) return { dist, prev, negativeCycle: false };
    dist.set(s, 0);
    const edgeList = g.edges().map(e => ({ u: e.from, v: e.to, w: e.weight }));

    for (let i = 0; i < nodes.length - 1; i++) {
        let changed = false;
        for (const e of edgeList) {
            const du = dist.get(e.u) ?? Infinity;
            if (du + e.w < (dist.get(e.v) ?? Infinity)) {
                dist.set(e.v, du + e.w);
                prev.set(e.v, e.u);
                changed = true;
            }
        }
        if (!changed) break;
    }

    // check for negative cycles
    let negativeCycle = false;
    for (const e of edgeList) {
        if ((dist.get(e.u) ?? Infinity) + e.w < (dist.get(e.v) ?? Infinity)) {
            negativeCycle = true;
            break;
        }
    }
    return { dist, prev, negativeCycle };
};

/* =========================
 * Topological sort / DAG checks
 * ========================= */

export const topologicalSort = (g: Graph): string[] | null => {
    if (!g.directed) return null; // topological sort only for directed graphs
    const inDeg = new Map<string, number>();
    for (const n of g.nodes()) inDeg.set(n, 0);
    for (const [u, m] of (g as any).adj.entries()) {
        for (const v of m.keys()) inDeg.set(v, (inDeg.get(v) ?? 0) + 1);
    }
    const queue = Array.from(inDeg.entries()).filter(([_, v]) => v === 0).map(([k]) => k);
    const order: string[] = [];
    while (queue.length) {
        const u = queue.shift()!;
        order.push(u);
        for (const nb of g.neighbors(u)) {
            const v = nb.id;
            inDeg.set(v, (inDeg.get(v) ?? 0) - 1);
            if ((inDeg.get(v) ?? 0) === 0) queue.push(v);
        }
    }
    if (order.length !== g.nodes().length) return null; // cycle detected
    return order;
};

export const isAcyclicDirected = (g: Graph): boolean => {
    return topologicalSort(g) !== null;
};

/* =========================
 * Tarjan's SCC algorithm
 * ========================= */

export const stronglyConnectedComponents = (g: Graph): string[][] => {
    const index = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    let idx = 0;
    const out: string[][] = [];

    const nodes = g.nodes();
    const visit = (v: string) => {
        index.set(v, idx);
        lowlink.set(v, idx);
        idx++;
        stack.push(v);
        onStack.add(v);

        for (const nb of g.neighbors(v)) {
            const w = nb.id;
            if (!index.has(w)) {
                visit(w);
                lowlink.set(v, Math.min(lowlink.get(v)!, lowlink.get(w)!));
            } else if (onStack.has(w)) {
                lowlink.set(v, Math.min(lowlink.get(v)!, index.get(w)!));
            }
        }

        if (lowlink.get(v) === index.get(v)) {
            const comp: string[] = [];
            let w: string;
            do {
                w = stack.pop()!;
                onStack.delete(w);
                comp.push(w);
            } while (w !== v);
            out.push(comp);
        }
    };

    for (const n of nodes) if (!index.has(n)) visit(n);
    return out;
};

/* =========================
 * Undirected connected components
 * ========================= */

export const connectedComponents = (g: Graph): string[][] => {
    const nodes = g.nodes();
    const seen = new Set<string>();
    const out: string[][] = [];
    for (const n of nodes) {
        if (seen.has(n)) continue;
        const comp: string[] = [];
        const q = [n];
        seen.add(n);
        while (q.length) {
            const u = q.shift()!;
            comp.push(u);
            for (const nb of g.neighbors(u)) {
                if (!seen.has(nb.id)) {
                    seen.add(nb.id);
                    q.push(nb.id);
                }
            }
        }
        out.push(comp);
    }
    return out;
};

/* =========================
 * Cycle detection for undirected graphs
 * ========================= */

export const isCyclicUndirected = (g: Graph): boolean => {
    const seen = new Set<string>();
    const parent = new Map<string, string | null>();

    for (const node of g.nodes()) {
        if (seen.has(node)) continue;
        const stack = [node];
        parent.set(node, null);
        seen.add(node);
        while (stack.length) {
            const u = stack.pop()!;
            for (const nb of g.neighbors(u)) {
                const v = nb.id;
                if (!seen.has(v)) {
                    seen.add(v);
                    parent.set(v, u);
                    stack.push(v);
                } else if (parent.get(u) !== v) {
                    return true;
                }
            }
        }
    }
    return false;
};

/* =========================
 * Minimum Spanning Tree: Kruskal & Prim
 * ========================= */

class UnionFind {
    private parent = new Map<string, string>();
    private rank = new Map<string, number>();
    constructor(nodes: string[]) {
        for (const n of nodes) {
            this.parent.set(n, n);
            this.rank.set(n, 0);
        }
    }
    find(x: string): string {
        const p = this.parent.get(x)!;
        if (p !== x) {
            const root = this.find(p);
            this.parent.set(x, root);
            return root;
        }
        return p;
    }
    union(a: string, b: string): boolean {
        const ra = this.find(a);
        const rb = this.find(b);
        if (ra === rb) return false;
        const raRank = this.rank.get(ra) ?? 0;
        const rbRank = this.rank.get(rb) ?? 0;
        if (raRank < rbRank) this.parent.set(ra, rb);
        else if (raRank > rbRank) this.parent.set(rb, ra);
        else {
            this.parent.set(rb, ra);
            this.rank.set(ra, raRank + 1);
        }
        return true;
    }
}

/** Kruskal MST (works for undirected graphs) */
export const kruskalMST = (g: Graph) => {
    const edges = g.edges().filter(e => !g.directed); // skip if directed
    const nodes = g.nodes();
    const uf = new UnionFind(nodes);
    edges.sort((a, b) => a.weight - b.weight);
    const mst: { from: string; to: string; weight: number }[] = [];
    let total = 0;
    for (const e of edges) {
        if (uf.union(e.from, e.to)) {
            mst.push(e);
            total += e.weight;
        }
    }
    return { mst, totalWeight: total };
};

/** Prim MST (handles dense graphs, starts from first node) */
export const primMST = (g: Graph) => {
    const nodes = g.nodes();
    if (!nodes.length || g.directed) return { mst: [], totalWeight: 0 };
    const start = nodes[0];
    const inMST = new Set<string>([start]);
    const heap = new MinHeap();
    for (const nb of g.neighbors(start)) heap.push({ key: `${start}->${nb.id}`, priority: nb.weight });
    const mst: { from: string; to: string; weight: number }[] = [];
    let total = 0;

    while (inMST.size < nodes.length && heap.size() > 0) {
        const item = heap.pop()!;
        if (!item) break;
        // parse key
        const [u, v] = item.key.split('->');
        const to = v;
        const from = u;
        if (inMST.has(to)) continue; // avoid cycles
        mst.push({ from, to, weight: item.priority });
        total += item.priority;
        inMST.add(to);
        for (const nb of g.neighbors(to)) {
            if (!inMST.has(nb.id)) heap.push({ key: `${to}->${nb.id}`, priority: nb.weight });
        }
    }
    return { mst, totalWeight: total };
};

/* =========================
 * Random graph generators
 * ========================= */

export const seededRng = (seed = Date.now()) => {
    let s = Math.floor(seed) >>> 0;
    return () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
};

export type RandomGraphOpts = {
    directed?: boolean;
    weighted?: boolean;
    prob?: number; // probability of an edge
    weightMin?: number;
    weightMax?: number;
    seed?: number;
};

/**
 * Generate a random graph using Erdos-Renyi model G(n, p).
 */
export const generateRandomGraph = (n = 10, opts?: RandomGraphOpts): Graph => {
    const {
        directed = false,
        weighted = false,
        prob = 0.2,
        weightMin = 1,
        weightMax = 10,
        seed
    } = opts ?? {};
    const rng = seed !== undefined ? seededRng(seed) : Math.random;
    const g = new Graph(directed);
    for (let i = 0; i < n; i++) g.addNode(String(i));
    for (let i = 0; i < n; i++) {
        for (let j = (directed ? 0 : i + 1); j < n; j++) {
            if (i === j) continue;
            if (rng() <= prob) {
                const w = weighted ? Math.round((weightMin + rng() * (weightMax - weightMin)) * 100) / 100 : 1;
                g.addEdge(String(i), String(j), w);
            }
        }
    }
    return g;
};

/**
 * Generate a complete graph with optional weights.
 */
export const generateCompleteGraph = (n = 5, weighted = false, weightMin = 1, weightMax = 10, seed?: number) => {
    const rng = seed !== undefined ? seededRng(seed) : Math.random;
    const g = new Graph(false);
    for (let i = 0; i < n; i++) g.addNode(String(i));
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const w = weighted ? Math.round((weightMin + rng() * (weightMax - weightMin)) * 100) / 100 : 1;
            g.addEdge(String(i), String(j), w);
        }
    }
    return g;
};

/**
 * Generate a 2D grid graph rows x cols (undirected).
 */
export const generateGridGraph = (rows: number, cols: number, weighted = false, seed?: number) => {
    const rng = seed !== undefined ? seededRng(seed) : Math.random;
    const g = new Graph(false);
    const key = (r: number, c: number) => `${r},${c}`;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) g.addNode(key(r, c));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const from = key(r, c);
            const right = c + 1 < cols ? key(r, c + 1) : null;
            const down = r + 1 < rows ? key(r + 1, c) : null;
            if (right) g.addEdge(from, right, weighted ? Math.round((1 + rng() * 9) * 100) / 100 : 1);
            if (down) g.addEdge(from, down, weighted ? Math.round((1 + rng() * 9) * 100) / 100 : 1);
        }
    }
    return g;
};

/* =========================
 * Small analytic helpers
 * ========================= */

export const degreeDistribution = (g: Graph) => {
    const map = new Map<number, number>();
    for (const n of g.nodes()) {
        const d = g.degree(n);
        map.set(d, (map.get(d) ?? 0) + 1);
    }
    return map;
};

export const adjacencyMatrix = (g: Graph) => {
    const nodes = g.nodes();
    const idx = new Map<string, number>();
    nodes.forEach((n, i) => idx.set(n, i));
    const n = nodes.length;
    const mat: (number | null)[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => null));
    for (const e of g.edges()) {
        const i = idx.get(e.from)!;
        const j = idx.get(e.to)!;
        mat[i][j] = e.weight;
        if (!g.directed) mat[j][i] = e.weight;
    }
    return { nodes, matrix: mat };
};

export const pathExists = (g: Graph, from: NodeId, to: NodeId) => {
    const start = toKey(from), goal = toKey(to);
    if (!g.hasNode(start) || !g.hasNode(goal)) return false;
    const q = [start];
    const seen = new Set<string>([start]);
    while (q.length) {
        const u = q.shift()!;
        if (u === goal) return true;
        for (const nb of g.neighbors(u)) {
            if (!seen.has(nb.id)) {
                seen.add(nb.id);
                q.push(nb.id);
            }
        }
    }
    return false;
};

/* =========================
 * Exports index
 * ========================= */

export const graphToolkitIndex = {
    Graph,
    bfs,
    dfs,
    dijkstra,
    bellmanFord,
    reconstructPath,
    topologicalSort,
    isAcyclicDirected,
    stronglyConnectedComponents,
    connectedComponents,
    isCyclicUndirected,
    kruskalMST,
    primMST,
    generateRandomGraph,
    generateCompleteGraph,
    generateGridGraph,
    degreeDistribution,
    adjacencyMatrix,
    pathExists,
    seededRng // exposed for reproducible demos
};