import type { MenuProps } from "antd";
import type React from "react";
import {
	BellOutlined,
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Layout, Space } from "antd";
import { useNavigate } from "react-router";
import { useUserStore } from "./hooks/useUserData";
import { logout } from "@/utils/tool";

const { Header } = Layout;

const HeaderContent: React.FC = () => {
	const navigate = useNavigate();
	const { userData } = useUserStore();
	const notificationItems: MenuProps = {
		items: [
			{
				key: "notification1",
				label: "系统通知：有新的更新",
			},
			{
				key: "notification2",
				label: "任务通知：代码审查请求",
			},
		],
	};

	const userMenuItems: MenuProps["items"] = [
		{
			key: "profile",
			label: "个人信息",
			icon: <UserOutlined />,
			onClick: () => navigate("/dashboard/userinfo"),
		},
		{
			key: "settings",
			label: "系统设置",
			icon: <SettingOutlined />,
		},
		{
			type: "divider",
		},
		{
			key: "logout",
			label: "退出登录",
			icon: <LogoutOutlined />,
			danger: true,
			onClick: () => {
				localStorage.removeItem("token");
				navigate("/login");
				logout();
			},
		},
	];
	return (
		<Header
			style={{ background: "#fff", padding: "0 24px" }}
			className="px-6 flex justify-between items-center"
		>
			<h2 className="text-xl font-medium">欢迎来到管理系统</h2>

			<Space size={40}>
				{/* 消息通知 */}
				<Dropdown menu={notificationItems} placement="bottomRight">
					<Badge count={2} size="default">
						<BellOutlined className="text-xl cursor-pointer hover:text-blue-200" />
					</Badge>
				</Dropdown>

				{/* 用户信息和设置 */}
				<Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
					<Space className="cursor-pointer hover:text-blue-200">
						<Avatar src={userData.avatar} icon={<UserOutlined />} />
						<span>
							{userData.username.length <= 5
								? userData.username
								: `${userData.username.substring(0, 5)}...`}
						</span>
					</Space>
				</Dropdown>
			</Space>
		</Header>
	);
};

export default HeaderContent;
