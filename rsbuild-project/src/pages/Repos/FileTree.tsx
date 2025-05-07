import type { FileTreeNode } from "@/utils/store";
import type { DataNode } from "antd/es/tree";
import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { Tree, Spin } from "antd";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRepoStore } from "./hooks/useRepoData";

const FileTree: React.FC = () => {
	const fileTree = useRepoStore((state) => state.fileTree);
	const selectedFile = useRepoStore((state) => state.selectedFile);
	const selectedRepo = useRepoStore((state) => state.selectedRepo);
	const loading = useRepoStore((state) => state.loading);
	const error = useRepoStore((state) => state.error);
	const setSelectedFile = useRepoStore((state) => state.setSelectedFile);
	const fetchFileTree = useRepoStore((state) => state.fetchFileTree);
	const fetchFileContent = useRepoStore((state) => state.fetchFileContent);

	// 添加展开的节点状态
	const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

	// 处理展开/折叠
	const onExpand = useCallback((expandedKeys: React.Key[]) => {
		setExpandedKeys(expandedKeys);
	}, []);

	// 将 FileTreeNode[] 转换为 Ant Design Tree 组件需要的 DataNode[]
	const convertToTreeData = useCallback((nodes: FileTreeNode[]): DataNode[] => {
		return nodes.map((node) => ({
			key: node.key,
			title: node.title,
			icon: node.type === "directory" ? <FolderOutlined /> : <FileOutlined />,
			children: node.children ? convertToTreeData(node.children) : undefined,
		}));
	}, []);

	// 当选择的仓库改变时，加载文件树
	useEffect(() => {
		if (selectedRepo) {
			console.log("文件树发现仓库变更:", selectedRepo);
			fetchFileTree(selectedRepo);
			// 重置展开状态
			setExpandedKeys([]);
		}
	}, [selectedRepo, fetchFileTree]);

	// 使用 useMemo 缓存转换结果，避免不必要的重新计算
	const treeData = useMemo(
		() => convertToTreeData(fileTree),
		[fileTree, convertToTreeData],
	);

	// 使用 useCallback 缓存函数引用
	const onSelect = useCallback(
		(selectedKeys: React.Key[], info: any) => {
			if (selectedKeys.length === 0) return;

			const selectedKey = selectedKeys[0].toString();

			// 避免重复选择相同文件
			if (selectedFile && selectedFile.key === selectedKey) {
				return;
			}

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

			const selectedNode = findNode(fileTree, selectedKey);

			if (selectedNode?.type === "file" && selectedRepo) {
				setSelectedFile(selectedNode);

				console.log("选择了新文件", selectedNode);

				fetchFileContent(
					selectedRepo.name,
					selectedNode.key,
					selectedRepo.branch,
				);
			}
		},
		[fileTree, selectedFile, selectedRepo, setSelectedFile, fetchFileContent],
	);

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
						expandedKeys={expandedKeys}
						onExpand={onExpand}
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

export default React.memo(FileTree);
