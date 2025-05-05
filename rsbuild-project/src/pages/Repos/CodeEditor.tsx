import React, { useRef, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRepoStore } from "./hooks/useRepoData";
import { Spin } from "antd";
import type { editor } from "monaco-editor";
import * as monaco from "monaco-editor";
import { useShallow } from "zustand/react/shallow";
// 定义 DiffLine 接口
export interface DiffLine {
	content: string;
	type: "add" | "delete" | "context";
	lineNumber: number;
}
// 在文件顶部定义常量
const DIFF_STYLES = `
  .diff-added-line {
    background-color: rgba(0, 255, 0, 0.1) !important;
  }
  .diff-removed-line {
    background-color: rgba(255, 0, 0, 0.1) !important;
  }
  .diff-added-gutter {
    border-left: 3px solid green !important;
  }
  .diff-removed-gutter {
    border-left: 3px solid red !important;
  }
  .diff-added-text {
    color: darkgreen !important;
  }
  .diff-removed-text {
    color: darkred !important;
  }
`;
const CodeEditor: React.FC = () => {
	const selectedFile = useRepoStore(useShallow((state) => state.selectedFile));
	const loading = useRepoStore((state) => state.loading);
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

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

	// 为 diff 文件添加装饰 - 完善版本
	// 为 diff 文件添加装饰和处理 readOnly
	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) return; // 确保 editor 实例存在

		const model = editor.getModel();
		if (!model) return; // 确保 model 存在

		let styleElement: HTMLStyleElement | null = null;
		let decorations: editor.IEditorDecorationsCollection | null = null;

		if (selectedFile?.diffLines && selectedFile.diffLines.length > 0) {
			// 添加样式 (带 ID 避免重复)
			const styleId = "monaco-diff-styles";
			styleElement = document.getElementById(styleId) as HTMLStyleElement;
			if (!styleElement) {
				styleElement = document.createElement("style");
				styleElement.id = styleId;
				styleElement.textContent = DIFF_STYLES;
				document.head.appendChild(styleElement);
			}

			// 应用装饰器
			const diffDecorations: editor.IModelDeltaDecoration[] = [];
			selectedFile.diffLines.forEach((line: DiffLine) => {
				const lineNumber = Math.max(1, line.lineNumber);
				// 检查行号是否超出模型范围
				if (lineNumber > model.getLineCount()) {
					console.warn(
						`Skipping decoration for invalid line number: ${lineNumber}`,
					);
					return; // 跳过无效行号
				}
				const lineLength = model.getLineLength(lineNumber) || 1;

				let decorationOptions: editor.IModelDecorationOptions | null = null;
				if (line.type === "add") {
					decorationOptions = {
						isWholeLine: true,
						className: "diff-added-line",
						linesDecorationsClassName: "diff-added-gutter",
						// inlineClassName: "diff-added-text", // inlineClassName 可能导致性能问题或冲突，优先使用行级样式
					};
				} else if (line.type === "delete") {
					decorationOptions = {
						isWholeLine: true,
						className: "diff-removed-line",
						linesDecorationsClassName: "diff-removed-gutter",
						// inlineClassName: "diff-removed-text",
					};
				}

				if (decorationOptions) {
					diffDecorations.push({
						range: new monaco.Range(lineNumber, 1, lineNumber, lineLength + 1),
						options: decorationOptions,
					});
				}
			});

			decorations = editor.createDecorationsCollection(diffDecorations);
		} else {
			// --- 非 Diff 文件处理 ---
			editor.createDecorationsCollection([]).clear(); // 清空装饰
		}

		// 返回清理函数
		return () => {
			decorations?.clear(); // 清除本次 effect 添加的装饰
			// 样式元素可以不清，或者根据需要决定是否在组件卸载时清除
			// const styleToRemove = document.getElementById("monaco-diff-styles");
			// if (styleToRemove && !selectedFile?.diffLines) { // 仅在不再需要时移除
			//   document.head.removeChild(styleToRemove);
			// }
		};
	}, [selectedFile]); // 依赖 selectedFile

	const handleEditorDidMount: OnMount = (editor) => {
		editorRef.current = editor;
	};

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

	return (
		<div className="h-full w-full">
			<Editor
				height="100%"
				width="100%"
				language={language}
				// 使用 key 来强制重新挂载编辑器，如果语言或核心配置变化很大时可能需要
				// key={selectedFile?.key || 'no-file'}
				value={selectedFile?.content || ""} // 确保有 selectedFile 才传递 content
				options={{
					readOnly: true,
					minimap: { enabled: true, maxColumn: 60 },
					scrollBeyondLastLine: false,
					fontSize: 14,
					lineNumbers: "on",
					lineDecorationsWidth: 10, // 稍微加宽以便显示 gutter 装饰
					renderLineHighlight: "all",
					automaticLayout: true, // 确保编辑器在容器大小变化时自适应
				}}
				onMount={handleEditorDidMount}
			/>
		</div>
	);
};

export default CodeEditor;
