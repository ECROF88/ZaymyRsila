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

// Git相关的API（模拟数据）
interface GitHistoryItem {
  hash: string;
  author: string;
  date: string;
  message: string;
  changes: Array<{
    file: string;
    insertions: number;
    deletions: number;
  }>;
}

interface GitDiffData {
  diff: string;
  files: string[];
}

const mockGitHistory: Record<number, GitHistoryItem[]> = {
  1: [
    {
      hash: "8d4e5f6",
      author: "张三",
      date: "2025-02-07T10:30:00Z",
      message: "实现用户登录功能",
      changes: [
        { file: "src/pages/Login.tsx", insertions: 120, deletions: 5 },
        { file: "src/utils/api.ts", insertions: 30, deletions: 0 }
      ]
    },
    {
      hash: "7c3d4e5",
      author: "李四",
      date: "2025-02-06T15:45:00Z",
      message: "优化页面布局样式",
      changes: [
        { file: "src/pages/Dashboard/Dashboard.tsx", insertions: 50, deletions: 30 },
        { file: "src/index.css", insertions: 80, deletions: 45 }
      ]
    },
    {
      hash: "6b2c3d4",
      author: "王五",
      date: "2025-02-05T09:15:00Z",
      message: "修复文件树显示bug",
      changes: [
        { file: "src/pages/Repos/FileTree.tsx", insertions: 15, deletions: 8 }
      ]
    }
  ]
};

const mockGitDiff: Record<number, Record<string, GitDiffData>> = {
  1: {
    "8d4e5f6": {
      diff: `diff --git a/src/pages/Login.tsx b/src/pages/Login.tsx
index a123456..b789012 100644
--- a/src/pages/Login.tsx
+++ b/src/pages/Login.tsx
@@ -1,5 +1,8 @@
 import React from 'react';
+import { Form, Input, Button } from 'antd';
+import { useNavigate } from 'react-router-dom';
+
 const Login: React.FC = () => {
+  const navigate = useNavigate();
   return (
     <div>
-      Login Page
+      <Form onFinish={(values) => console.log(values)}>
+        <Form.Item name="username" rules={[{ required: true }]}>
+          <Input placeholder="用户名" />
+        </Form.Item>
+      </Form>
     </div>
   );
};`,
      files: ["src/pages/Login.tsx", "src/utils/api.ts"]
    },
    "7c3d4e5": {
      diff: `diff --git a/src/index.css b/src/index.css
index c234567..d890123 100644
--- a/src/index.css
+++ b/src/index.css
@@ -10,6 +10,10 @@ body {
   margin: 0;
   padding: 0;
 }
+
+.container {
+  max-width: 1200px;
+  margin: 0 auto;
+}`,
      files: ["src/index.css", "src/pages/Dashboard/Dashboard.tsx"]
    },
    "6b2c3d4": {
      diff: `diff --git a/src/pages/Repos/FileTree.tsx b/src/pages/Repos/FileTree.tsx
index e345678..f901234 100644
--- a/src/pages/Repos/FileTree.tsx
+++ b/src/pages/Repos/FileTree.tsx
@@ -15,7 +15,7 @@ const FileTree: React.FC = () => {
   };

   return (
-    <Tree data={data} />
+    <Tree data={data} defaultExpandAll />
   );
};`,
      files: ["src/pages/Repos/FileTree.tsx"]
    }
  }
};

export const getGitHistory = (repoId: number) => {
  return new Promise<{ data: ApiResponse<GitHistoryItem[]> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 0,
          data: mockGitHistory[repoId] || mockGitHistory[1],
          message: "success"
        }
      });
    }, 500);
  });
};

export const getGitDiff = (repoId: number, hash: string) => {
  return new Promise<{ data: ApiResponse<GitDiffData> }>((resolve) => {
    setTimeout(() => {
      const diffData = mockGitDiff[repoId]?.[hash] || mockGitDiff[1][hash];
      resolve({
        data: {
          code: 0,
          data: diffData || { diff: "", files: [] },
          message: "success"
        }
      });
    }, 500);
  });
};

export { authApi, protectedApi };
