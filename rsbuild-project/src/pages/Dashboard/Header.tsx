import type { MenuProps } from "antd";
import type React from "react";
import {
	BellOutlined,
	LogoutOutlined,
	SettingOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Empty, Layout, List, Space, Typography } from "antd";
import { useNavigate } from "react-router";
import { useUserStore } from "./hooks/useUserData";
import { logout } from "@/utils/tool";
import { useEffect, useState } from "react";
import { getMessage, GetMessageResponse } from "@/utils/api";

const { Header } = Layout;

const HeaderContent: React.FC = () => {
	const navigate = useNavigate();
	const { userData } = useUserStore();
	const [userMsg, setUserMsg] = useState<GetMessageResponse[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		const fetchUserMsg = async () => {
			const res = await getMessage();

			if (res.status === 200) {
				// 处理消息数据
				console.log("获取消息成功", res.data.data);
				setUserMsg(res.data.data);
				const unread = res.data.data.filter(msg => msg.read_status === 'unread').length;
				setUnreadCount(unread);
			} else {
				console.error("获取消息失败");
			}
		}
		fetchUserMsg();
	}, [])

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


	const notificationContent = (
		<div className="w-80 max-h-96 overflow-auto bg-gray-300 rounded-2xl p-2">
			<div className="py-2 px-4 border-b flex justify-between items-center">
				<Typography.Text strong>通知消息</Typography.Text>
				{/* <Typography.Link onClick={() => navigate('/dashboard/message')}>
					查看全部
				</Typography.Link> */}
			</div>
			{userMsg.length > 0 ? (
				<List
					// dataSource={userMsg.slice(0, 5)} // 最多显示5条消息
					dataSource={userMsg}
					renderItem={item => (
						<List.Item
							className={`px-4 py-2 rounded-2xl hover:bg-gray-100 cursor-pointer border-b ${item.read_status === 'unread' ? 'bg-blue-50' : ''}`}
						>
							<List.Item.Meta
								title={
									<div className="flex justify-between">
										<Typography.Text strong={item.read_status === 'unread'}>
											{(() => {
												switch (item.message_type) {
													case 'system': return '系统通知';
													case 'notification': return '通知消息';
													case 'alert': return '警告提醒';
													case 'repo_update': return '仓库更新';
													default: return '新消息';
												}
											})()}
										</Typography.Text>
										<Typography.Text type="secondary" className="text-xs">
											{new Date(item.created_at).toLocaleDateString()}
										</Typography.Text>
									</div>
								}
								description={
									<Typography.Paragraph ellipsis={{ rows: 2 }}>
										{item.content}
									</Typography.Paragraph>
								}
							/>
						</List.Item>
					)}
				/>
			) : (
				<Empty
					image={Empty.PRESENTED_IMAGE_SIMPLE}
					description="暂无消息"
					className="py-8"
				/>
			)}
			{/* <div className="p-2 border-t text-center bg-gray-50">
				<Typography.Link onClick={() => navigate('/dashboard/message')}>
					进入消息中心
				</Typography.Link>
			</div> */}
		</div>
	);

	return (
		<Header
			style={{ background: "#fff", padding: "0 24px" }}
			className="px-6 flex justify-between items-center"
		>
			<h2 className="text-xl font-medium">欢迎来到管理系统</h2>

			<Space size={40}>
				{/* 消息通知 */}
				<Dropdown dropdownRender={() => notificationContent} placement="bottomRight" trigger={['click']}>
					<Badge count={unreadCount} size="default" offset={[0, 5]}>
						<BellOutlined className="text-xl cursor-pointer hover:text-blue-500 p-1" />
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
