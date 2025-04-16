import { handleAuthError, isAuthenticated, logout } from "@/utils/tool";
import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	useEffect(() => {
		const checkAuth = () => {
			const isAuth = isAuthenticated();
			setAuthenticated(isAuth);
			if (!isAuth) {
				handleAuthError();
			}
			setLoading(false);
		};
		checkAuth();
	});
	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<Spin tip="验证登录状态..." size="large" />
			</div>
		);
	}

	if (!authenticated) {
		// 保存尝试访问的路径，以便登录后重定向回来
		return <Navigate to={redirectPath} state={{ from: location }} replace />;
	}
	return <Outlet />;
};
export default ProtectedRoute;
