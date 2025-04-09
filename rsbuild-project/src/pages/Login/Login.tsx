import type React from "react";
import type { LoginData } from "../../utils/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../../utils/api";
// import { useStore } from 'zustand';z
// import { useStore } from '../utils/store';

export default function Login() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<LoginData>({
		identity: "",
		password: "",
	});
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await login(formData);
			if (response.data.code === 0) {
				localStorage.setItem("token", response.data.data);
				navigate("/");
			} else {
				setError(response.data.message);
			}
		} catch {
			setError("登录失败，请稍后重试");
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};
	const input_css =
		"block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:border-purple-300";
	return (
		<div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 overflow-hidden animate-gradient">
			<div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
			<div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
			<div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

			<div className="relative z-10 w-full max-w-2xl p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60">
				<div>
					<div className="flex flex-col items-center">
						<div className="w-60 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform hover:rotate-12 transition-transform duration-300">
							<span className="text-3xl text-white font-bold">
								Code Manager
							</span>
						</div>
						<h2 className="text-center text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
							登录账户
						</h2>
					</div>
					<p className="mt-4 text-center text-lg text-gray-700">
						或者{" "}
						<Link
							to="/register"
							className="font-semibold text-blue-600 hover:text-blue-500"
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
								<title>错误提示图标</title>
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
								// className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:border-purple-300"
								className={input_css}
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
								// className="block w-full px-4 py-4 text-lg border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:border-purple-300"
								className={input_css}
								placeholder="请输入密码"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="mt-8 w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-xl text-white              
                bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-200 shadow-lg transform hover:scale-[1.02]"
						>
							登录
						</button>
					</div>
				</form>
				<button
					type="button"
					className="mt-4 flex justify-around text-2xl  text-blue-400 hover:text-emerald-500 border-2 w-full duration-300 ease-in-out"
					onClick={() => {
						navigate("/dashboard");
					}}
				>
					go to dashboard
				</button>
			</div>
		</div>
	);
}
