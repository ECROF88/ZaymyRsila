import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useState, useEffect } from 'react';

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

// 模拟的仓库数据
const initialRepos: Repo[] = [
    { id: 1, name: 'my-project' },
    { id: 2, name: 'another-repo' },
    { id: 3, name: 'sample-app' },
];

// 模拟的文件树数据 (针对第一个仓库)
const initialFileTree: FileTreeNode[] = [
    {
        key: 'src',
        title: 'src',
        type: 'directory',
        children: [
            {
                key: 'src/App.tsx',
                title: 'App.tsx',
                type: 'file',
                content: 'import React from "react";\n\nfunction App() {\n  return <h1>Hello, World!</h1>;\n}',
            },
            {
                key: 'src/index.tsx',
                title: 'index.tsx',
                type: 'file',
                content: '// Entry point of your application',
            },
        ],
    },
    {
        key: 'public',
        title: 'public',
        type: 'directory',
        children: [
            {
                key: 'public/index.html',
                title: 'index.html',
                type: 'file',
                content: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My App</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>',
            },
        ],
    },
    {
        key: 'README.md',
        title: 'README.md',
        type: 'file',
        content: '# My Project\n\nThis is a sample project.',
    },
];

export const useRepoStore = create<RepoStore>()(
    devtools(
        (set) => ({
            repos: initialRepos,
            selectedRepo: initialRepos[0],
            fileTree: initialFileTree,
            selectedFile: null,

            setSelectedRepo: (repo) => {
                set({ selectedRepo: repo });
                if (repo) {
                    set((state) => {
                        // 模拟获取文件树
                        const newFileTree = repo.id === 1 ? initialFileTree : [];
                        return {
                            fileTree: newFileTree,
                            selectedFile: null
                        };
                    });
                }
            },

            setSelectedFile: (file) => set({ selectedFile: file }),

            fetchFileTree: async (repo) => {
                try {
                    // 这里可以添加加载状态
                    set({ fileTree: [] });

                    // 模拟 API 调用
                    const newFileTree = repo.id === 1 ? initialFileTree : [];

                    set({
                        fileTree: newFileTree,
                        selectedFile: null
                    });
                } catch (error) {
                    console.error('Failed to fetch file tree:', error);
                    // 可以添加错误处理状态
                }
            }
        }),
        { name: 'repo-store' }
    )
);

// 导出便捷的 hook
export default function useRepoData() {
    return useRepoStore();
}