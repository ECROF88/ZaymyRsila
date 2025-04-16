import { Layout } from "antd";
import type React from "react";
import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

const { Content } = Layout;

const DashboardLayout: React.FC = () => {
	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Sidebar />
			<Layout>
				<Header />
				<Content className="m-4 p-4 bg-auto">
					<Outlet />
				</Content>
				<Footer />
			</Layout>
		</Layout>
	);
};

export default DashboardLayout;
