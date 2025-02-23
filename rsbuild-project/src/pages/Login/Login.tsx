import type { LoginData } from '../../utils/api'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { login } from '../../utils/api'
// import { useStore } from 'zustand';
// import { useStore } from '../utils/store';

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<LoginData>({
    identity: '',
    password: '',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await login(formData)
      if (response.data.code === 0) {
        localStorage.setItem('token', response.data.data)
        navigate('/')
      }
      else {
        setError(response.data.message)
      }
    }
    catch {
      setError('登录失败，请稍后重试')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden">
      <div className="relative z-10 w-full max-w-2xl p-12 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/60">
        <div>
          <h2 className="mt-2 text-center text-5xl font-extrabold text-gray-800">
            登录账户
          </h2>
          <p className="mt-4 text-center text-base text-gray-600">
            或者
            {' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              注册新账号
            </Link>
          </p>
        </div>

        <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
          {error && (
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
              <span className="text-red-800 text-lg">{error}</span>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label
                htmlFor="identity"
                className="block text-lg font-medium text-gray-700 mb-2"
              >
                用户名/邮箱
              </label>
              <input
                id="identity"
                name="identity"
                type="text"
                required
                className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="请输入用户名或邮箱"
                value={formData.identity}
                onChange={handleChange}
              />
            </div>
            <div>
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
          </div>

          <div>
            <button
              type="submit"
              className="mt-8 w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white bg-blue-300 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 shadow-lg"
            >
              登录
            </button>
            <button onClick={() => navigate('/test2')}>Test2</button>
          </div>
        </form>
      </div>
    </div>
  )
}
