import { Layout } from "antd";
// src/components/Repos/ReposLayout.tsx
import type React from "react";
import CodeEditor from "./CodeEditor";
import FileTree from "./FileTree";
import GitState from "./Git/GitState";
import useRepoData from "./hooks/useRepoData";
import RepoList from "./ReposList";

const { Sider, Content } = Layout;

const ReposLayout: React.FC = () => {
	const { selectedRepo } = useRepoData();

	return (
		<Layout className="h-[calc(100vh-100px)]">
			<Sider width={250} theme="light" className="overflow-auto">
				<RepoList />
			</Sider>
			<div className="w-full">
				<Content className="p-1 overflow-hidden h-full">
					{selectedRepo ? (
						<div className="flex h-full">
							<div className="flex-none w-[250px] mr-4 border-r border-gray-200 overflow-auto">
								<FileTree />
							</div>
							<div className="flex-1 flex flex-col h-full overflow-hidden">
								{/* 编辑器区域 - 占据50%高度 */}
								<div className="h-1/2 overflow-hidden mb-2 border border-gray-200 rounded-md shadow-sm">
									<CodeEditor />
								</div>

								{/* Git状态区域 - 占据50%高度 */}
								<div className="h-1/2 overflow-hidden border border-gray-200 rounded-md shadow-sm">
									<GitState repo={selectedRepo} />
								</div>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-full text-gray-500">
							请选择一个仓库和文件。
						</div>
					)}
				</Content>
			</div>
		</Layout>
	);
};

export default ReposLayout;
