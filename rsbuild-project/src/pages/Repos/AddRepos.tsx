import { Button, Form, Input, message, Modal } from "antd";
import { cloneRepo, CloneRepoData } from "../../utils/api";
import { useRepoStore } from "./hooks/useRepoData";
import { useEffect, useState } from "react";
import {
	WebSocketEventType,
	useWebSocketStore,
	RepoCloneCompletedData,
	initWebSocket,
} from "../../utils/websocket";

interface AddReposProps {
	isModalOpen: boolean;
	setIsModalOpen: (open: boolean) => void;
}

export default function AddRepos({
	isModalOpen,
	setIsModalOpen,
}: AddReposProps) {
	// 确保WebSocket只初始化一次
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			console.log("init web socket");
			initWebSocket();
		}
	}, []);

	const [messageApi, contextHolder] = message.useMessage();
	const [isCloning, setIsCloning] = useState(false);
	const [cloningRepo, setCloningRepo] = useState("");

	// 获取 WebSocket 状态管理
	const { addEventHandler, removeEventHandler } = useWebSocketStore();

	const handleCompleted = (data: RepoCloneCompletedData) => {
		console.log("克隆完成:", data);

		// 显示成功消息
		messageApi.success(`仓库 ${data.repo_name} 克隆完成!`);
		console.log(`仓库 ${data.repo_name} 克隆完成!`);

		// 重新获取仓库列表
		useRepoStore.getState().fetchRepos();

		// 重置克隆状态
		setIsCloning(false);
		setCloningRepo("");

		// 显式关闭模态框
		setTimeout(() => {
			console.log("正在关闭模态框...");
			setIsModalOpen(false);
		}, 500);
	};

	const handleFailed = (data: RepoCloneCompletedData) => {
		console.error("克隆失败:", data);

		// 显示错误消息
		messageApi.error(`仓库 ${data.repo_name} 克隆失败: ${data.message}`);
		console.log(`仓库 ${data.repo_name} 克隆失败: ${data.message}`);

		// 重置克隆状态
		setIsCloning(false);
		setCloningRepo("");

		// 由于失败，不自动关闭模态框，让用户可以重新尝试
	};

	// 注册 WebSocket 事件处理器
	useEffect(() => {
		console.log("注册WebSocket事件处理器");

		// 注册事件处理器
		addEventHandler(WebSocketEventType.REPO_CLONE_COMPLETED, handleCompleted);
		addEventHandler(WebSocketEventType.REPO_CLONE_FAILED, handleFailed);

		// 清理事件处理器
		return () => {
			console.log("清理WebSocket事件处理器");
			removeEventHandler(
				WebSocketEventType.REPO_CLONE_COMPLETED,
				handleCompleted,
			);
			removeEventHandler(WebSocketEventType.REPO_CLONE_FAILED, handleFailed);
		};
	}, []); // 移除依赖项，避免重复注册

	const handleAddRepo = async (values: CloneRepoData) => {
		console.log("添加仓库:", values.repo_url);

		try {
			// 显示loading消息
			messageApi.loading({
				content: `正在发送克隆请求...`,
				duration: 2,
			});

			const response = await cloneRepo(values);
			console.log("添加仓库请求已发送", response);

			if (response.data.code === 0) {
				// 请求发送成功，等待WebSocket通知结果
				setIsCloning(true);
				setCloningRepo(values.repo_name);

				// 显示持续的loading消息
				messageApi.loading({
					content: `正在克隆仓库 ${values.repo_name}，请稍候...`,
					duration: 3,
				});
			} else {
				// 请求发送失败
				messageApi.error(response.data.message || "添加仓库请求失败");
				setIsModalOpen(false);
			}
		} catch (error) {
			messageApi.error("添加仓库请求失败");
			console.error("添加仓库出错:", error);
			setIsModalOpen(false);
		}
	};

	return (
		<div>
			{contextHolder}
			<Modal
				title="添加新仓库"
				open={isModalOpen}
				onCancel={() => {
					// 如果正在克隆，不允许关闭
					if (!isCloning) {
						console.log("close");
						setIsModalOpen(false);
					}
				}}
				footer={null}
				closable={!isCloning}
				maskClosable={!isCloning}
			>
				{isCloning ? (
					<div className="py-12 text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-6"></div>
						<h3 className="text-lg font-medium text-gray-800 mb-2">
							正在克隆仓库: {cloningRepo}
						</h3>
						<p className="text-gray-500">请稍候，克隆完成后将自动关闭此窗口</p>
					</div>
				) : (
					<Form
						layout="vertical"
						onFinish={(values: CloneRepoData) => {
							handleAddRepo(values);
						}}
					>
						<Form.Item
							name="repo_url"
							label="仓库URL"
							rules={[{ required: true, message: "请输入仓库URL" }]}
						>
							<Input placeholder="例如: https://github.com/username/repo.git" />
						</Form.Item>
						<Form.Item
							name="repo_name"
							label="仓库名称"
							rules={[{ required: true, message: "请输入仓库名称" }]}
						>
							<Input placeholder="为仓库指定一个便于识别的名称" />
						</Form.Item>
						<Form.Item className="text-right">
							<Button type="primary" htmlType="submit">
								添加
							</Button>
						</Form.Item>
					</Form>
				)}
			</Modal>
		</div>
	);
}
