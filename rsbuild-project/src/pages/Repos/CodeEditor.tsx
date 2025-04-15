import React from "react";
import Editor from "@monaco-editor/react";
import useRepoData from "./hooks/useRepoData";
import { Spin } from "antd";

const CodeEditor: React.FC = () => {
	const { selectedFile, loading } = useRepoData();

	// 根据文件扩展名确定语言
	const getLanguageFromFilename = (filename: string) => {
		if (!filename) return "text";
		const extension = filename.split(".").pop()?.toLowerCase();

		const languageMap: Record<string, string> = {
			js: "javascript",
			jsx: "javascript",
			ts: "typescript",
			tsx: "typescript",
			py: "python",
			java: "java",
			html: "html",
			css: "css",
			json: "json",
			md: "markdown",
			rust: "rust",
			rs: "rust",
			c: "c",
			cpp: "cpp",
			h: "cpp",
			go: "go",
			php: "php",
			rb: "ruby",
			swift: "swift",
			sh: "shell",
			yml: "yaml",
			yaml: "yaml",
			sql: "sql",
			xml: "xml",
		};

		return languageMap[extension || ""] || "text";
	};

	// 获取当前文件的语言
	const language = selectedFile?.title
		? getLanguageFromFilename(selectedFile.title)
		: "text";

	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<Spin tip="加载文件内容..." />
			</div>
		);
	}

	if (!selectedFile) {
		return (
			<div className="h-full w-full flex items-center justify-center text-gray-500">
				请从左侧文件树中选择一个文件
			</div>
		);
	}

	if (selectedFile.diffLines) {
		// 显示差异视图
		return (
			<div className="h-full w-full">
				<Editor
					height="100%"
					width="100%"
					language={language}
					value={selectedFile.content || ""}
					options={{
						readOnly: true,
						minimap: { enabled: true },
						scrollBeyondLastLine: false,
						fontSize: 14,
						lineNumbers: "on",
						lineDecorationsWidth: 0,
					}}
				/>
			</div>
		);
	}

	return (
		<div className="h-full w-full">
			<Editor
				height="100%"
				width="100%"
				language={language}
				value={selectedFile.content || ""}
				options={{
					readOnly: true,
					minimap: { enabled: true },
					scrollBeyondLastLine: false,
					fontSize: 14,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
