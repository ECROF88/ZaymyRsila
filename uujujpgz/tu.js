function floydWarshallWithPath(graph) {
    const n = graph.length;
    const dist = Array.from({ length: n }, () =>
        Array(n).fill(Infinity)
    );
    const next = Array.from({ length: n }, () =>
        Array(n).fill(null)
    );

    // 正确初始化 dist 和 next
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            dist[i][j] = graph[i][j];
            if (graph[i][j] !== Infinity && i !== j) {
                next[i][j] = j;
            }
        }
    }

    // 修正的动态规划过程
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    const newDist = dist[i][k] + dist[k][j];
                    if (newDist < dist[i][j]) {
                        dist[i][j] = newDist;
                        next[i][j] = next[i][k];
                    }
                }
            }
        }
    }

    return { dist, next };
}

function getPath(next, i, j) {
    if (next[i][j] === null) {
        return null; // 表示不存在路径
    }
    const path = [i];
    while (i !== j) {
        i = next[i][j];
        if (path.includes(i)) {
            throw new Error('Cycle detected in path');
        }
        path.push(i);
    }
    return path;
}
const graph = [
    [0, 4, Infinity, Infinity, Infinity, Infinity],
    [4, 0, 2, Infinity, 12, Infinity],
    [Infinity, 2, 0, 3, Infinity, 10],
    [Infinity, Infinity, 3, 0, Infinity, 5],
    [Infinity, 12, Infinity, Infinity, 0, Infinity],
    [Infinity, Infinity, 10, 5, Infinity, 0]
];
// 示例测试
// const { dist, next } = floydWarshallWithPath(graph);
// console.log("所有节点对的最短路径:", dist);
// console.log("从节点 0 到节点 3 的路径:", getPath(next, 0, 3)); // 输出 [0, 1, 2, 3]


function dijkstra(graph, start) {
    const n = graph.length;
    const dist = new Array(n).fill(Infinity);
    dist[start] = 0;
    const visited = new Array(n).fill(false);
    let count = 0;
    // 当还没将所有节点加入的时候
    while (count != n) {
        let minDistance = Infinity;
        let cur = null;
        for (let j = 0; j < n; j++) {
            if (!visited[j] && dist[j] < minDistance) {
                minDistance = dist[j];
                cur = j;
            }
        }
        visited[cur] = true;
        count++;
        // 更新 cur 节点的邻居节点的距离
        for (let j = 0; j < n; j++) {
            if (graph[cur][j] !== Infinity) {
                const newDistance = dist[cur] + graph[cur][j];
                if (newDistance < dist[j]) {
                    dist[j] = newDistance;
                }
            }
        }
    }
    return dist;
}
const graph2 = [
    [0, 4, Infinity, Infinity, Infinity, Infinity, Infinity, 8, Infinity], // 节点 0
    [4, 0, 8, Infinity, Infinity, Infinity, Infinity, 11, Infinity], // 节点 1
    [Infinity, 8, 0, 7, Infinity, 4, Infinity, Infinity, 2], // 节点 2
    [Infinity, Infinity, 7, 0, 9, 14, Infinity, Infinity, Infinity], // 节点 3
    [Infinity, Infinity, Infinity, 9, 0, 10, Infinity, Infinity, Infinity], // 节点 4
    [Infinity, Infinity, 4, 14, 10, 0, 2, Infinity, Infinity], // 节点 5
    [Infinity, Infinity, Infinity, Infinity, Infinity, 2, 0, 1, 6], // 节点 6
    [8, 11, Infinity, Infinity, Infinity, Infinity, 1, 0, 7], // 节点 7
    [Infinity, Infinity, 2, Infinity, Infinity, Infinity, 6, 7, 0]  // 节点 8
];
const startNode = 0;
const shortestDistances = dijkstra(graph, startNode);

console.log("从节点", startNode, "出发的最短距离:", shortestDistances);