
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

export interface RepoStore {
    repos: Repo[];
    selectedRepo: Repo | null;
    fileTree: FileTreeNode[];
    selectedFile: FileTreeNode | null;
    setSelectedRepo: (repo: Repo | null) => void;
    setSelectedFile: (file: FileTreeNode | null) => void;
    fetchFileTree: (repo: Repo) => void;
    addRepo: (repo: Omit<Repo, 'id'>) => void;
    deleteRepo: (id: number) => void;
}

// export const useAddRepoStore = create()