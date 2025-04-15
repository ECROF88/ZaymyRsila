import type { CommitDetail, CommitFileChange } from "./types";
import React from "react";

interface DiffViewProps {
	commitDetail: CommitDetail | null;
	selectedCommit: string | null;
	onViewInEditor: (fileChange: CommitFileChange) => void;
}

const DiffView: React.FC<DiffViewProps> = ({
	commitDetail,
	selectedCommit,
	onViewInEditor,
}) => {
	return (
		<div className="w-full max-w-[30svw] flex flex-col h-full bg-white rounded-lg shadow-lg border border-indigo-100">
			<div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-400 rounded-t-lg">
				<h2 className="text-xl font-bold text-white">差异详情</h2>
				{selectedCommit && (
					<div className="text-sm text-indigo-100 mt-1">
						提交哈希：
						{selectedCommit.substring(0, 8)}
					</div>
				)}
				{commitDetail?.commit_info && (
					<div className="text-sm text-indigo-100 mt-1">
						作者：{commitDetail.commit_info.author}
					</div>
				)}
			</div>
			<div className="flex-1 overflow-auto p-4">
				{commitDetail ? (
					<div className="space-y-6">
						<div className="bg-indigo-50 p-4 rounded-lg">
							<h3 className="font-medium text-indigo-800 mb-2">提交信息</h3>
							<div className="bg-white p-3 rounded border border-indigo-100">
								{commitDetail.commit_info.message}
							</div>
						</div>

						<div className="bg-indigo-50 p-4 rounded-lg">
							<h3 className="font-medium text-indigo-800 mb-3">修改文件</h3>
							<ul className="space-y-2">
								{commitDetail.file_changes.map((fileChange) => (
									<li
										key={fileChange.path}
										className="text-sm bg-white px-3 py-2 rounded border border-indigo-100 flex justify-between items-center cursor-pointer hover:bg-indigo-50 transition-colors"
										onClick={() => onViewInEditor(fileChange)}
									>
										<div className="flex items-center">
											<span
												className={`mr-2 px-1.5 py-0.5 rounded text-xs ${
													fileChange.status === "added"
														? "bg-green-100 text-green-700"
														: fileChange.status === "removed"
															? "bg-red-100 text-red-700"
															: "bg-blue-100 text-blue-700"
												}`}
											>
												{fileChange.status === "added"
													? "新增"
													: fileChange.status === "deleted"
														? "删除"
														: "修改"}
											</span>
											<span>{fileChange.path}</span>
										</div>
										<button
											className="text-xs px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition-colors"
											onClick={(e) => {
												e.stopPropagation();
												onViewInEditor(fileChange);
											}}
										>
											查看
										</button>
									</li>
								))}
							</ul>
						</div>

						{/* 可以选择在这里显示选中的文件差异，或者让用户点击后在编辑器中查看 */}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="text-3xl mb-2">👆</div>
						<div className="text-gray-400">选择左侧提交查看详细变更</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default DiffView;
