import { create } from 'zustand'

// const useBearStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
// }))

// const useStore = create(set => ({
//     votes =0
// }))


// 定义仓库的数据类型
export interface Repo {
    id: number;
    name: string;
    description?: string;
    url?: string;
}

// 定义文件树节点的数据类型
export interface FileTreeNode {
    key: string;
    title: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
    content?: string; // 文件内容 (只有文件节点才有)
}

interface RepoStore {
    repos: Repo[];
    selectedRepo: Repo | null;
    fileTree: FileTreeNode[];
    selectedFile: FileTreeNode | null;
    setSelectedRepo: (repo: Repo | null) => void;
    setSelectedFile: (file: FileTreeNode | null) => void;
    fetchFileTree: (repo: Repo) => void;
}
// interface VoteStore {
//     votes: number
//     setVotes: () => void
// }

// export const useStore = create<VoteStore>((set) => ({
//     votes: 0,
//     setVotes: () => set((state) => ({ votes: state.votes + 1 })),
// }))