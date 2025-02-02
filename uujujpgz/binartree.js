class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    root = null;
    constructor() {
        this.root = null;
    }
}

/// 前序遍历：
function preOrder(tree) {
    let node = tree.root;
    if (node === null) {
        return;
    }

    let stack = [];
    while (stack.length > 0 || node !== null) {
        if (node !== null) {
            console.log(node.data);
            stack.push(node);
            node = node.left;
        }
        else {
            node = stack.pop();
            node = node.right;
        }
    }
}
/// 中序遍历：
function inOrder(tree) {
    let node = tree.root;
    if (node === null) {
        return;
    }
    let stack = [];
    while (stack.length > 0 || node !== null) {
        while (node !== null) {
            stack.push(node);
            node = node.left;
        }
        node = stack.pop();
        console.log(node.data);
        node = node.right;
    }
}
function preOrderTraversal(root) {
    const result = [];
    if (!root) return result; // 如果根节点为空，直接返回

    const stack = [root]; // 使用栈来模拟递归
    while (stack.length > 0) {
        const node = stack.pop(); // 弹出栈顶节点
        result.push(node.data); // 访问根节点

        // 先右后左入栈，保证左子树先出栈
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    return result;
}

// 根据先序遍历和中序遍历构建二叉树
function buildTreeByPreAndIn(preOrder, inOrder) {
    // 构建中序遍历的哈希表，用于快速查找根节点位置
    const inOrderMap = new Map();
    for (let i = 0; i < inOrder.length; i++) {
        inOrderMap.set(inOrder[i], i);
    }

    // 递归构建二叉树
    const build = (preStart, preEnd, inStart, inEnd) => {
        // 递归终止条件
        if (preStart > preEnd || inStart > inEnd) {
            return null;
        }

        // 先序遍历的第一个节点是根节点
        const rootValue = preOrder[preStart];
        const root = new Node(rootValue);

        // 在中序遍历中找到根节点的位置
        const rootIndexInOrder = inOrderMap.get(rootValue);

        // 计算左子树的节点数量
        const leftTreeSize = rootIndexInOrder - inStart;

        // 递归构建左子树
        root.left = build(
            preStart + 1, // 左子树的先序遍历起始位置
            preStart + leftTreeSize, // 左子树的先序遍历结束位置
            inStart, // 左子树的中序遍历起始位置
            rootIndexInOrder - 1 // 左子树的中序遍历结束位置
        );

        // 递归构建右子树
        root.right = build(
            preStart + leftTreeSize + 1, // 右子树的先序遍历起始位置
            preEnd, // 右子树的先序遍历结束位置
            rootIndexInOrder + 1, // 右子树的中序遍历起始位置
            inEnd // 右子树的中序遍历结束位置
        );

        return root;
    };

    return build(0, preOrder.length - 1, 0, inOrder.length - 1);
}
/// test :
// let tree = new Tree();
// tree.root = new Node(1);
// tree.root.left = new Node(2);
// tree.root.right = new Node(3);
// tree.root.left.left = new Node(4);
// tree.root.left.right = new Node(5);

// console.log('preOrder:');
// preOrder(tree);
// console.log('preOrderTraversal:');
// let result = preOrderTraversal(tree.root);
// console.log(result);

// console.log('inOrder:');
// inOrder(tree);

const _preOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const _inOrder = [2, 3, 1, 5, 4, 7, 8, 6, 9];
let root = buildTreeByPreAndIn(_preOrder, _inOrder);
console.log(root);