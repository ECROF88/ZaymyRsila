import axios from 'axios';
import { Repo } from './store';

const authApi = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const protectedApi = axios.create({
  baseURL: 'http://localhost:3000/api/protected',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// token拦截器
protectedApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginData {
  identity: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
}

// 认证相关的API
export const login = (data: LoginData) => {
  return authApi.post<ApiResponse<string>>('/login', data);
};

export const register = (data: RegisterData) => {
  return authApi.post<ApiResponse<null>>('/register', data);
};

// 需要认证的API
export const addRepo = (data: string) => {
  return protectedApi.get<ApiResponse<Repo>>('/repo/add', { params: { data } });
};

export const upload = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return protectedApi.post<ApiResponse<UploadResponse>>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export { authApi, protectedApi };
