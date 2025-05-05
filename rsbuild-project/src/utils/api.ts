import { CommitDetail, CommitInfo } from '@/pages/Repos/Git/types'
import type { UserData, Repo } from './store'
import axios from 'axios'
import { handleAuthError } from './tool'
import { PassWordChange } from '@/pages/Dashboard/UserInfo'

const authApi = axios.create({
  baseURL: 'http://localhost:3003/api/auth',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const protectedApi = axios.create({
  baseURL: 'http://localhost:3003/api/protected',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// token拦截器
protectedApi.interceptors.request.use(
  (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

protectedApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 处理 401 (Unauthorized) 或 403 (Forbidden) 错误
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('认证失败，请重新登录');
      handleAuthError();
    }
    return Promise.reject(error);
  }
)
export interface LoginData {
  identity: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  confirmPassword: string
  email: string
}

export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export interface UploadResponse {
  url: string
  fileName: string
  fileSize: number
}

export interface CloneRepoData {
  repo_url: string
  repo_name: string
}

export interface FileNode {
  name: string;
  path: string;
  is_dir: boolean;
  size?: number;
  children: FileNode[];
}

// 认证相关的API
export function login(data: LoginData) {
  return authApi.post<ApiResponse<string>>('/login', data)
}

export function register(data: RegisterData) {
  return authApi.post<ApiResponse<null>>('/register', data)
}

export function updateEmail(data:string){
  return protectedApi.post<ApiResponse<null>>('/user/update/email',data);
}

export function updatePassword(data:string){
  return protectedApi.post<ApiResponse<null>>('/user/update/password')
}


// clone repo for user
export function cloneRepo(data: CloneRepoData) {
  return protectedApi.post<ApiResponse<null>>('/repo/clone', data)
}

/**
 * 获取用户数据
 * @returns 返回用户数据
 */
export function getUserData() {
  return protectedApi.get<ApiResponse<UserData>>('user/userdata')
}

/**
 * 获取所有仓库
 * @returns 返回仓库列表
 */
export function getRepos() {
  return protectedApi.get<ApiResponse<Repo[]>>('/repo/repos')
}

// 获取仓库文件列表
export function getFiles(repo_name: string) {
  return protectedApi.get<ApiResponse<FileNode[]>>(`/repo/files?repo_name=${encodeURIComponent(repo_name)}`)
}



export function upload(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return protectedApi.post<ApiResponse<UploadResponse>>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取文件内容
 * @param repo_name 仓库名称
 * @param file_path 文件路径
 * @param branch 分支名称
 * @returns 文件内容字符串
 */
export function getFileContent(repo_name: string, file_path: string, branch: string = 'main') {
  return protectedApi.get<string>(
    `/repo/filecontent?repo_name=${repo_name}&file_path=${file_path}&branch=${branch}`,
    {
      transformResponse: [(data) => data], // 保持原始响应，不进行 JSON 解析
      responseType: 'text',
    }
  )
}

interface getCommitHistoriesRequest {
  repo_name:string,
  limit:number,
}

export function getCommitHistories(data:getCommitHistoriesRequest){
  return protectedApi.get<ApiResponse<CommitInfo[]>>("/repo/commithistories",{params:data});
}


interface getDiffRequest{
  repo_name:string,
  commit_id:string,
}
export function getDiff(data:getDiffRequest){
  return protectedApi.get<ApiResponse<CommitDetail>>("/repo/getdiff",{params:data})
}

// Git相关的API
// interface CommitInfo {
//   author: string
//   id: string
//   message: string
//   time: number
// }

// interface CommitFileChange {
//   diff: string
//   path: string
//   status: string
// }

// interface CommitDetail {
//   commit_info: CommitInfo
//   file_changes: CommitFileChange[]
// }

// 用于历史提交列表的简化结构
interface GitHistoryItem {
  id: string
  author: string
  message: string
  time: number
}

const mockGitHistory: Record<number, GitHistoryItem[]> = {
  1: [
    {
      id: '6f7f06441aed631f75ead2c6290acc635bd45a9b',
      author: 'Kiwi2333 <1329634286@qq.com>',
      message: 'Update: `登录窗口`添加窗口大小渐变动画并优化样式\n',
      time: 1744008801,
    },
    {
      id: '7c3d4e5',
      author: '李四 <lisi@example.com>',
      message: '优化页面布局样式',
      time: 1744000000,
    },
    {
      id: '6b2c3d4',
      author: '王五 <wangwu@example.com>',
      message: '修复文件树显示bug',
      time: 1743900000,
    },
  ],
}

const mockCommitDetails: Record<number, Record<string, CommitDetail>> = {
  1: {
    '6f7f06441aed631f75ead2c6290acc635bd45a9b': {
      commit_info: {
        author: 'Kiwi2333 <1329634286@qq.com>',
        id: '6f7f06441aed631f75ead2c6290acc635bd45a9b',
        message: 'Update: `登录窗口`添加窗口大小渐变动画并优化样式\n',
        time: 1744008801,
      },
      file_changes: [
        {
          diff: ' diff --git a/.vscode/settings.json b/.vscode/settings.json\nindex 2e7aed7..e65e8e3 100644\n--- a/.vscode/settings.json\n+++ b/.vscode/settings.json\n@@ -4,8 +4,7 @@\n \n   \"files.associations\": {\n     \"*.css\": \"postcss\"\n-  },\n-\n+  }, \n   // Auto fix\n   \"editor.codeActionsOnSave\": {\n     \"source.fixAll.eslint\": \"never\",\n@@ -13,6 +12,7 @@\n   },\n \n   \"prettier.enable\": false,\n+  \"editor.defaultFormatter\": \"esbenp.prettier-vscode\",\n   \"editor.formatOnSave\": true,\n \n   // Silent the stylistic rules in you IDE, but still auto fix them\n@@ -61,5 +61,8 @@\n   \"iconify.inplace\": true,\n   \"idf.customExtraVars\": {\n     \"IDF_TARGET\": \"esp32s3\"\n+  },\n+  \"[rust]\": {\n+    \"editor.defaultFormatter\": \"rust-lang.rust-analyzer\"\n   }\n }\n',
          path: '.vscode/settings.json',
          status: 'modified',
        },
      ],
    },
    '7c3d4e5': {
      commit_info: {
        author: '李四 <lisi@example.com>',
        id: '7c3d4e5',
        message: '优化页面布局样式',
        time: 1744000000,
      },
      file_changes: [
        {
          diff: `diff --git a/src/index.css b/src/index.css
index c234567..d890123 100644
--- a/src/index.css
+++ b/src/index.css
@@ -10,6 +10,10 @@ body {
  margin: 0;
  padding: 0;
}

+.container {
+  max-width: 1200px;
+  margin: 0 auto;
+}`,
          path: 'src/index.css',
          status: 'modified',
        },
        {
          diff: `diff --git a/src/pages/Dashboard/Dashboard.tsx b/src/pages/Dashboard/Dashboard.tsx
...`,
          path: 'src/pages/Dashboard/Dashboard.tsx',
          status: 'modified',
        },
      ],
    },
    '6b2c3d4': {
      commit_info: {
        author: '王五 <wangwu@example.com>',
        id: '6b2c3d4',
        message: '修复文件树显示bug',
        time: 1743900000,
      },
      file_changes: [
        {
          diff: ` diff --git a/README.md b/README.md\nindex 58a6772..e0a5e6e 100644\n--- a/README.md\n+++ b/README.md\n@@ -1,5 +1,6 @@\n MY EZ and SIMPLE LOG \n \n-use buffer to log.\n+use buffer to log. I also use crossbeam and lazy_static to help me.\n+\n+Example is in main.rs and loginfo.log   \n \n-Example is in main.rs and loginfo.log    \n\\ No newline at end of file\n`,
          path: 'README.md',
          status: 'modified',
        },
      ],
    },
  },
}

export function getGitHistory(repoId: number) {
  return new Promise<{ data: ApiResponse<GitHistoryItem[]> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 0,
          data: mockGitHistory[repoId] || mockGitHistory[1],
          message: 'success',
        },
      })
    }, 500)
  })
}

export function getGitCommitDetail(repoId: number, commitId: string) {
  return new Promise<{ data: ApiResponse<CommitDetail> }>((resolve) => {
    setTimeout(() => {
      const commitDetail =
        mockCommitDetails[repoId]?.[commitId] ||
        mockCommitDetails[1][commitId] || {
          commit_info: {
            author: '',
            id: commitId,
            message: '未找到提交信息',
            time: 0,
          },
          file_changes: [],
        }

      resolve({
        data: {
          code: 0,
          data: commitDetail,
          message: 'success',
        },
      })
    }, 500)
  })
}

// 保留旧的接口以兼容现有代码，但将其标记为已弃用
/**
 * @deprecated 使用 getGitCommitDetail 替代
 */
export function getGitDiff(repoId: number, hash: string) {
  return getGitCommitDetail(repoId, hash).then((response) => {
    const commitDetail = response.data.data
    return {
      data: {
        code: 0,
        data: {
          diff: commitDetail.file_changes.map((fc) => fc.diff).join('\n'),
          files: commitDetail.file_changes.map((fc) => fc.path),
        },
        message: 'success',
      },
    }
  })
}

export { authApi, protectedApi }
