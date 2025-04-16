import {
	FolderOutlined,
	PlusOutlined,
	StarOutlined,
	TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Row } from "antd";
import { useNavigate } from "react-router";
import Card from "../../component/Card";
import NumberShow from "../../component/NumberShow";
import { useRepoStore } from "../Repos/hooks/useRepoData";
import { useUserStore } from "./hooks/useUserData";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
function Home() {
	const userData = useUserStore(useShallow((state) => state.userData));

	const loading = useUserStore(useShallow((state) => state.loading));
	const error = useUserStore(useShallow((state) => state.error));

	const navigate = useNavigate();

	const repos = useRepoStore((state) => state.repos);
	const reposLoading = useRepoStore(useShallow((state) => state.loading));
	const reposError = useRepoStore(useShallow((state) => state.error));

	useEffect(() => {
		const loadData = async () => {
			const fetchRepos = useRepoStore.getState().fetchRepos;
			fetchRepos();
			const fetchUserDataFromStore = useUserStore.getState().fetchUserData;
			fetchUserDataFromStore();
		};
		loadData();
	}, []);

	return (
		<div className="home-container">
			{/* 错误提示 */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
					<p className="flex items-center">
						<span className="mr-2">⚠️</span> {error}
					</p>
				</div>
			)}
			{/* 仓库数据错误提示 */}
			{reposError && (
				<div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg">
					<p className="flex items-center">
						<span className="mr-2">⚠️</span> {reposError}
					</p>
				</div>
			)}

			{/* 用户数据显示 */}
			{loading ? (
				<Card className="mb-6 p-4 flex justify-center">
					<div className="flex items-center">
						<div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
						<span>加载用户数据中...</span>
					</div>
				</Card>
			) : (
				<Card className="mb-6 overflow-hidden">
					<div className="flex items-center gap-4">
						<Avatar size={64} src={userData?.avatar} />
						<div>
							<h1 className="text-2xl mb-2">
								欢迎回来，
								{userData?.username || "访客"}
							</h1>
							<p className="text-gray-500">{userData?.email || "未登录"}</p>
						</div>
					</div>
				</Card>
			)}

			{/* 统计区域 */}
			<Row gutter={16} className="mb-6">
				<Col span={8}>
					<Card bodyStyle={{ padding: "16px" }}>
						<NumberShow
							title="仓库总数"
							value={reposLoading ? "加载中..." : repos?.length || 0}
							prefix={<FolderOutlined />}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card bodyStyle={{ padding: "16px" }}>
						<NumberShow
							title="代码提交"
							value={123}
							prefix={<StarOutlined />}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card bodyStyle={{ padding: "16px" }}>
						<NumberShow title="协作者" value={5} prefix={<TeamOutlined />} />
					</Card>
				</Col>
			</Row>

			{/* 快捷操作区域 */}
			<Card title="快捷操作" className="mb-6 overflow-hidden">
				<div className="flex gap-4">
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={() => navigate("/dashboard/repos")}
					>
						添加仓库
					</Button>
					<Button
						icon={<TeamOutlined />}
						onClick={() => navigate("/dashboard/userinfo")}
					>
						个人信息
					</Button>
				</div>
			</Card>

			{/* 主要内容区域 */}
			<Row gutter={16}>
				<Col span={12}>
					<Card title="最近活动" className="min-h-[300px] overflow-hidden">
						<p>暂无最近活动</p>
					</Card>
				</Col>
				<Col span={12}>
					<Card title="常用仓库" className="min-h-[300px] overflow-hidden">
						{repos && repos.length > 0 ? (
							<div className="max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
								<ul className="list-none p-0">
									{repos.map((repo) => (
										<li
											key={repo.id}
											className="py-2 border-b last:border-b-0 flex justify-between items-center"
										>
											<span>{repo.name}</span>
											{repo.branch && (
												<span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
													{repo.branch}
												</span>
											)}
										</li>
									))}
								</ul>
							</div>
						) : reposLoading ? (
							<div className="flex justify-center items-center h-32">
								<div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
							</div>
						) : (
							<p>暂无仓库</p>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
}

export default Home;
