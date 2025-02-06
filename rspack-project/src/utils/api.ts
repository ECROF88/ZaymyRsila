import axios from 'axios';
import { Repo } from './store';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/auth',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
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

export const login = (data: LoginData) => {
  return api.post<ApiResponse<string>>('/login', data);
};

export const register = (data: RegisterData) => {
  return api.post<ApiResponse<null>>('/register', data);
};

export const addRepo = (data: string) => {
  return api.get<ApiResponse<Repo>>('/addrepo', { params: { data } });
}


export default api;
