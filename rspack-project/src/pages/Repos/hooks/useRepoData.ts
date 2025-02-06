import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useState, useEffect } from 'react';
import { FileTreeNode, Repo } from '@/utils/store';
import { RepoStore } from '@/utils/store';
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
            },
            addRepo: (newRepo) => {
                set((state) => ({
                    repos: [...state.repos, { ...newRepo, id: Date.now() }]
                }));
            },

            deleteRepo: (id) => {
                set((state) => ({
                    repos: state.repos.filter(repo => repo.id !== id),
                    selectedRepo: state.selectedRepo?.id === id ? null : state.selectedRepo
                }));
            }
        }),
        { name: 'repo-store' }
    )
);

// 导出便捷的 hook
export default function useRepoData() {
    return useRepoStore();
}