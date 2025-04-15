import type { DiffLine, ParsedDiff } from '../pages/Repos/Git/types'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createSelectors } from './createSelectors'
// 定义仓库的数据类型
export interface Repo {
  id: number
  name: string
  description?: string
  url: string
  branch?:string
}

// 定义文件树节点的数据类型
export interface FileTreeNode {
  key: string
  title: string
  type: 'file' | 'directory'
  children?: FileTreeNode[]
  content?: string // 文件内容 (只有文件节点才有)
  size?: number  // 添加文件大小属性
  diffLines?: DiffLine[] // 差异信息
}

export interface DiffContent {
  content: string
  fileName: string
}
export interface RepoStore {
  repos: Repo[]
  selectedRepo: Repo | null
  fileTree: FileTreeNode[]
  selectedFile: FileTreeNode | null
  diffContent: DiffContent | null
  loading: boolean // 添加加载状态
  error: string | null // 添加错误状态
  fetchRepos: () => Promise<void> // 添加获取仓库的方法
  setSelectedRepo: (repo: Repo | null) => void
  setSelectedFile: (file: FileTreeNode | null) => void
  fetchFileTree: (repo: Repo) => Promise<void>
  addRepo: (repo: Omit<Repo, 'id'>) => void
  deleteRepo: (id: number) => void
  setDiffContent: (content: ParsedDiff, fileName: string) => void
  fetchFileContent: (repo_name: string, file_path: string, branch?: string) => Promise<void>;
}
export interface UserData {
  username: string
  email: string
  avatar?: string
}

interface TCatStoreState {
  cats: {
    bigCats: number
    smallCats: number
  }
  increaseBigCats: () => void
  increaseSmallCats: () => void
  summary: () => string
}

// 使用immer中间件实现代码的简化

export const useCatStore = createSelectors(
  create<TCatStoreState>()(
    immer(
      devtools((set, get) => ({
        cats: {
          bigCats: 10,
          smallCats: 0,
        },
        increaseBigCats: () =>
          set((state) => {
            // cats: {
            //     ...state.cats,
            //     bigCats: state.cats.bigCats + 1
            // }
            state.cats.bigCats++
          }),
        increaseSmallCats: () =>
          set((state) => {
            state.cats.smallCats++
          }),
        summary: () => {
          const total = get().cats.bigCats + get().cats.smallCats
          return `there are ${total} cats in total`
        },
      })),
    ),
  ),
)
