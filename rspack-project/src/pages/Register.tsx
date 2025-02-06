import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import clsx from 'clsx';
import { register } from '../utils/api';

interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });

  const [errors, setErrors] = useState<{
    general: string;
    email: string;
    username: string;
  }>({
    general: '',
    email: '',
    username: '',
  });

  // 邮箱验证函数
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 用户名校验函数
  const validateUsername = (username: string) => {
    if (username.length < 3) {
      return '用户名至少为 3 个字符';
    }
    return '';
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 进行简单的表单校验
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, general: '两次输入的密码不一致' });
      return;
    }

    if (errors.email || errors.username) {
      return;
    }

    try {
      const response = await register(formData);
      if (response.data.code === 0) {
        navigate('/login');
      } else {
        setErrors({ ...errors, general: response.data.message });
      }
    } catch {
      setErrors({ ...errors, general: '注册失败，请稍后重试' });
    }
  };

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // 动态校验
    if (name === 'email') {
      if (!value) {
        setErrors({ ...errors, email: '邮箱不能为空' });
      } else if (!validateEmail(value)) {
        setErrors({ ...errors, email: '请输入有效的邮箱地址' });
      } else {
        setErrors({ ...errors, email: '' });
      }
    }

    if (name === 'username') {
      const usernameError = validateUsername(value);
      setErrors({ ...errors, username: usernameError });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl p-12 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/60">
        <div>
          <h2 className="mt-2 text-center text-5xl font-extrabold text-gray-800">
            注册新账号
          </h2>
          <p className="mt-4 text-center text-base text-gray-600">
            或者{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              登录
            </Link>
          </p>
        </div>
        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="flex items-center justify-center bg-red-50 p-4 rounded-xl">
              <svg
                className="w-6 h-6 text-red-400 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 text-lg">{errors.general}</span>
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                用户名
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="请输入用户名"
                value={formData.username}
                onChange={handleChange}
              />
              <p className="mt-2 text-sm text-red-400 h-2">{errors.username}</p>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700 mb-1"
              >
                邮箱
              </label>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => setErrors({ ...errors, email: '' })}
              ></input>
              {/* {errors.email && (
                <p className="mt-2 text-base text-red-500">{errors.email}</p>
              )} */}
              <p className="mt-2 text-sm text-red-400 h-2">{errors.email}</p>
            </div>
            <div className="mb-10">
              <label
                htmlFor="password"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                确认密码
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="请再次输入密码"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="mt-8 w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-lg"
            >
              注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
