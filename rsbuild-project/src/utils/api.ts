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

interface UpdateRequest {
  email: string,
  avatar?: string,
  department_id: string
}

export function updateEmail(data: UpdateRequest) {
  return protectedApi.post<ApiResponse<null>>('/user/update', data);
}

export function updatePassword(data: string) {
  return protectedApi.post<ApiResponse<null>>('/user/change_password', data)
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


export interface DepartmentInfo{
  id:number;
  name:string,
}
// 获取全部部门信息
export function getAllDepartment() {
  return protectedApi.get<ApiResponse<DepartmentInfo[]>>(`/user/departments`)
}


export const mockDepartmentsResponse: ApiResponse<DepartmentInfo[]> = {
  code: 200,
  data: [
    { id: 1, name: '技术部' },
    { id: 2, name: '市场部' },
    { id: 3, name: '人事部' },
    { id: 4, name: 'dev1' },
    { id: 21, name: 'dev2' },
    { id: 22, name: 'dev3' },
  ],
  message: 'Success',
};

// 模拟 getAllDepartment 函数
export const mockGetAllDepartment = async (): Promise<{ data: ApiResponse<DepartmentInfo[]> }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: mockDepartmentsResponse });
    }, 500); // 模拟网络延迟
  });
};


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
  repo_name: string,
  limit: number,
  page: number
}

export function getCommitHistories(data: getCommitHistoriesRequest) {
  return protectedApi.get<ApiResponse<CommitInfo[]>>("/repo/commithistories", { params: data });
}


interface getDiffRequest {
  repo_name: string,
  commit_id: string,
}
export function getDiff(data: getDiffRequest) {
  return protectedApi.get<ApiResponse<CommitDetail>>("/repo/getdiff", { params: data })
}

interface getRepoTotalCount {
  repo_name: string
}

export function getRepoTotalCount(data: getRepoTotalCount) {
  return protectedApi.get<ApiResponse<number>>("/repo/commit_count", { params: data })
}


// 用于历史提交列表的简化结构
interface GitHistoryItem {
  id: string
  author: string
  message: string
  time: number
}







export { authApi, protectedApi }
