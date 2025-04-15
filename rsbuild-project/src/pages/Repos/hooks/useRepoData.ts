import type { DiffContent, FileTreeNode, Repo, RepoStore } from '@/utils/store'
import type { ParsedDiff } from '../Git/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getRepos, getFiles, getFileContent, FileNode } from '@/utils/api'

// 模拟的仓库数据
const initialRepos: Repo[] = [
  { id: 1, name: 'my-project' ,url:"http://xxx" },
  { id: 2, name: 'another-repo' ,url:"http://xxx" },
  { id: 3, name: 'sample-app',url:"http://xxx" },
]

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
]

// 将后端返回的 FileNode 转换为前端使用的 FileTreeNode
const convertToFileTreeNode = (fileNodes: FileNode[]): FileTreeNode[] => {
  return fileNodes.map(node => ({
    key: node.path,
    title: node.name,
    type: node.is_dir ? 'directory' : 'file',
    content: '', // 文件内容暂时留空，需要时再加载
    size: node.size,
    children: node.children ? convertToFileTreeNode(node.children) : undefined
  }));
};

export const useRepoStore = create<RepoStore>()(
  devtools(
    set => ({
      diffContent: null as DiffContent | null,
      repos: [],
      selectedRepo: null,
      fileTree: [],
      selectedFile: null,
      loading: false, // 添加加载状态
      error: null, // 添加错误状态

      fetchRepos: async () => {
        try {
          set({ loading: true, error: null });
          const response = await getRepos();
          
          if (response?.data?.code === 0 && response.data.data) {
            console.log(response);
            set({ 
              repos: response.data.data,
              loading: false,
              // 如果有仓库且没有选中仓库，默认选中第一个
              // selectedRepo: state => state.selectedRepo || (response.data.data.length > 0 ? response.data.data[0] : null)
            });
          } else {
            throw new Error(response?.data?.message || '获取仓库数据失败');
          }
        } catch (error) {
          console.error('获取仓库列表失败:', error);
          set({ 
            error: error instanceof Error ? error.message : '获取仓库列表失败',
            loading: false 
          });
        }
      },

      setSelectedRepo: (repo) => {
        set({ selectedRepo: repo })
        if (repo) {
          set(() => {
            // 模拟获取文件树
            // todo
            const newFileTree = repo.id === 1 ? initialFileTree : []
            return {
              fileTree: newFileTree,
              selectedFile: null,
            }
          })
        }
      },

      setSelectedFile: file => set({ selectedFile: file }),

      fetchFileTree: async (repo) => {
        try {
          set({ loading: true, error: null });

          if (!repo || !repo.name) {
            throw new Error('仓库名称为空');
          }

          const response = await getFiles(repo.name);
          
          if (response?.data?.code === 0 && Array.isArray(response.data.data)) {
            const fileTreeNodes = convertToFileTreeNode(response.data.data);
            set({
              fileTree: fileTreeNodes,
              selectedFile: null,
              loading: false
            });
          } else {
            throw new Error(response?.data?.message || '获取文件列表失败');
          }
        }
        catch (error) {
          console.error('Failed to fetch file tree:', error);
          set({ 
            error: error instanceof Error ? error.message : '获取文件列表失败',
            loading: false 
          });
        }
      },

      fetchFileContent: async (repo_name: string, file_path: string, branch: string = 'main') => {
        try {
          set({ loading: true, error: null });
          
          const response = await getFileContent(repo_name, file_path, branch);
          console.log("getFileContent res:", response);
          
          // 后端直接返回文本内容，而不是封装在ApiResponse中
          if (response.status === 200) {
            // 更新选中文件的内容
            set(state => {
              // 如果没有选中文件，直接返回当前状态
              if (!state.selectedFile) return state;
              
              // 创建一个新的selectedFile对象，保留原始属性并更新content
              return {
                selectedFile: {
                  ...state.selectedFile,
                  content: response.data  // 直接使用响应数据，而非response.data.data
                },
                loading: false
              };
            });
          } else {
            throw new Error(`获取文件内容失败: ${response.statusText}`);
          }
        } catch (error) {
          console.error('获取文件内容失败:', error);
          set({ 
            error: error instanceof Error ? error.message : '获取文件内容失败',
            loading: false 
          });
        }
      },

      addRepo: (newRepo) => {
        set(state => ({
          repos: [...state.repos, { ...newRepo, id: Date.now() }],
        }))
      },

      deleteRepo: (id) => {
        set(state => ({
          repos: state.repos.filter(repo => repo.id !== id),
          selectedRepo: state.selectedRepo?.id === id ? null : state.selectedRepo,
        }))
      },

      setDiffContent: (parsedDiff: ParsedDiff, fileName: string) => {
        set({
          diffContent: { content: parsedDiff.content, fileName },
          selectedFile: {
            key: `diff-${fileName}`,
            title: `Diff: ${fileName}`,
            type: 'file',
            content: parsedDiff.content,
            diffLines: parsedDiff.lines,
          },
        })
      },
    }),
    { name: 'repo-store' },
  ),
)

// 导出便捷的 hook
export default function useRepoData() {
  return useRepoStore()
}
