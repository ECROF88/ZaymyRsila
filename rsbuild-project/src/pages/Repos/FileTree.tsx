import type { FileTreeNode } from "@/utils/store";
import type { DataNode } from "antd/es/tree";
import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { Tree, Spin } from "antd";
import React, { useEffect } from "react";
import useRepoData from "./hooks/useRepoData";

const FileTree: React.FC = () => {
	const {
		fileTree,
		selectedFile,
		setSelectedFile,
		selectedRepo,
		loading,
		error,
		fetchFileTree,
		fetchFileContent,
	} = useRepoData();

	// 将 FileTreeNode[] 转换为 Ant Design Tree 组件需要的 DataNode[]
	const convertToTreeData = (nodes: FileTreeNode[]): DataNode[] => {
		return nodes.map((node) => ({
			key: node.key,
			title: node.title,
			icon: node.type === "directory" ? <FolderOutlined /> : <FileOutlined />,
			children: node.children ? convertToTreeData(node.children) : undefined,
		}));
	};

	// 当选择的仓库改变时，加载文件树
	useEffect(() => {
		if (selectedRepo) {
			console.log("文件树发现仓库变更:", selectedRepo);
			fetchFileTree(selectedRepo);
		}
	}, [selectedRepo, fetchFileTree]);

	const treeData = convertToTreeData(fileTree);

	// 修改 onSelect 函数
	const onSelect = (selectedKeys: React.Key[], info: any) => {
		// 递归查找节点
		const findNode = (
			nodes: FileTreeNode[],
			key: string,
		): FileTreeNode | null => {
			for (const node of nodes) {
				if (node.key === key) return node;
				if (node.children) {
					const found = findNode(node.children, key);
					if (found) return found;
				}
			}
			return null;
		};

		const selectedNode = findNode(fileTree, selectedKeys[0]?.toString() || "");
		if (selectedNode?.type === "file" && selectedRepo) {
			// 先设置选中文件，这样可以立即更新UI
			setSelectedFile(selectedNode);
			console.log("选择了新文件", selectedNode);

			// 然后获取文件内容
			fetchFileContent(
				selectedRepo.name,
				selectedNode.key,
				selectedRepo.branch,
			);
		}
	};

	if (!selectedRepo) {
		return <div className="p-4 text-gray-500">请先选择一个仓库</div>;
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<Spin tip="加载文件中..." />
			</div>
		);
	}

	if (error) {
		return <div className="p-4 text-red-500">加载文件失败: {error}</div>;
	}

	return (
		<div className="p-2">
			{fileTree.length === 0 ? (
				<div className="text-gray-500 p-4">该仓库没有文件</div>
			) : (
				<div className="max-h-screen">
					<Tree
						showLine={true}
						showIcon={true}
						defaultExpandedKeys={["0-0-0"]}
						onSelect={onSelect}
						selectedKeys={selectedFile ? [selectedFile.key] : []}
						treeData={treeData}
						className="whitespace-nowrap"
					/>
				</div>
			)}
		</div>
	);
};

export default FileTree;
