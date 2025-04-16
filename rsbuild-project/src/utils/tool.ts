import { message } from "antd"
import { useNavigate } from "react-router"

function getLanguageByExtension(fileKey: string): string {
  const extension = fileKey.split('.').pop()?.toLowerCase()
  const mapping: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'javascript',
    tsx: 'javascript',
    html: 'html',
    css: 'css',
    json: 'json',
    md: 'markdown',
    c: 'cpp',
    cpp: 'cpp',
  }
  return mapping[extension || ''] || 'plaintext'
}



export const isAuthenticated= ():boolean => {
  return !!localStorage.getItem('token')
}

export const logout = ():void => {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

export const handleAuthError = (): void => {
  console.log("重新登录。。。")
  alert("登录已过期，请重新登录")
  logout();
};

export { getLanguageByExtension }
