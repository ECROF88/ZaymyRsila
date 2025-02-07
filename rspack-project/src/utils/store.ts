
import { DiffLine, ParsedDiff } from '../pages/Repos/Git/types';

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
    diffLines?: DiffLine[]; // 差异信息
}

export interface DiffContent {
    content: string;
    fileName: string;
}

export interface RepoStore {
    repos: Repo[];
    selectedRepo: Repo | null;
    fileTree: FileTreeNode[];
    selectedFile: FileTreeNode | null;
    diffContent: DiffContent | null;
    setSelectedRepo: (repo: Repo | null) => void;
    setSelectedFile: (file: FileTreeNode | null) => void;
    fetchFileTree: (repo: Repo) => void;
    addRepo: (repo: Omit<Repo, 'id'>) => void;
    deleteRepo: (id: number) => void;
    setDiffContent: (content: ParsedDiff, fileName: string) => void;
}
export interface UserData {
    name: string;
    email: string;
    avatar?: string
}
