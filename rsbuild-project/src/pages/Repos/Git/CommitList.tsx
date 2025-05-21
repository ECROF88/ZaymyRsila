import type { CommitDetail, CommitInfo, GitCommit } from "./types";
import React from "react";

interface CommitListProps {
	commits: CommitInfo[];
	selectedCommit: string | null;
	onSelectCommit: (hash: string) => void;
	loading: boolean;
	currentPage: number;
	totalCommits: number;
	commitsPerPage: number;
	onPageChange: (page: number) => void;
}

const CommitList: React.FC<CommitListProps> = ({
	commits,
	selectedCommit,
	onSelectCommit,
	loading,
	currentPage,
	totalCommits,
	commitsPerPage,
	onPageChange
}) => {

	const totalPages = Math.ceil(totalCommits / commitsPerPage);
	const pageNumbers = [];
	for (let i = 1; i <= totalPages; i++) {
		pageNumbers.push(i);
	}
	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
		return date.toLocaleString();
	};

	return (
		<div className="w-full flex flex-col h-full bg-white rounded-lg shadow-lg border border-indigo-100">
			<div className="p-4 border-b bg-gradient-to-r from-blue-500 to-indigo-400 rounded-t-lg">
				<h2 className="text-xl font-bold text-white">提交历史</h2>
			</div>
			<div className="flex-1 overflow-auto">
				{loading ? (
					<div className="flex justify-center items-center h-full">
						<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
					</div>
				) : commits.length > 0 ? (
					<ul className="divide-y">
						{commits.map((commit) => (
							<li
								key={commit.id}
								onClick={() => onSelectCommit(commit.id)}
								className={`p-4 cursor-pointer transition-colors ${selectedCommit === commit.id
									? "bg-indigo-50 border-l-4 border-indigo-500"
									: "hover:bg-gray-50"
									}`}
							>
								<div className="font-medium text-indigo-700 mb-1 break-words">
									{commit.message}
								</div>
								<div className="flex flex-col text-xs text-gray-500 mt-2">
									<span>作者: {commit.author.split("<")[0].trim()}</span>
									<span>日期: {formatDate(commit.time)}</span>
									<span className="font-mono">
										哈希: {commit.id.substring(0, 8)}
									</span>
								</div>
							</li>
						))}
					</ul>
				) : (
					<div className="text-center py-12">
						<div className="text-gray-400">暂无提交记录</div>
					</div>
				)}

				{/* 分页控件 */}
				<div className="p-3 bg-gray-50 flex items-center justify-center space-x-2">
					<button
						onClick={() => onPageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className={`px-3 py-1 rounded ${currentPage === 1
							? "bg-gray-200 text-gray-400"
							: "bg-blue-500 text-white hover:bg-blue-600"
							}`}
					>
						上一页
					</button>

					<div className="flex space-x-1">
						{/* 显示第一页 */}
						{totalPages > 7 && currentPage > 3 && (
							<>
								<button
									onClick={() => onPageChange(1)}
									className="w-8 h-8 rounded flex items-center justify-center bg-gray-200 hover:bg-gray-300"
								>
									1
								</button>
								{/* 省略号 */}
								{currentPage > 4 && (
									<span className="w-8 h-8 flex items-center justify-center">...</span>
								)}
							</>
						)}

						{/* 显示当前页附近的页码 */}
						{pageNumbers.filter(number => {
							if (totalPages <= 7) return true; // 如果总页数不多，全部显示

							const nearCurrentPage = Math.abs(number - currentPage) <= 1;

							// 判断第一页按钮是否会独立显示
							const showsDedicatedFirstButton = totalPages > 7 && currentPage > 3;
							// 判断最后一页按钮是否会独立显示
							const showsDedicatedLastButton = totalPages > 7 && currentPage < totalPages - 2;

							// 如果第一页由独立按钮显示，则中间列表不再显示1
							if (number === 1 && showsDedicatedFirstButton) {
								return false;
							}
							// 如果最后一页由独立按钮显示，则中间列表不再显示totalPages
							if (number === totalPages && showsDedicatedLastButton) {
								return false;
							}

							// 显示当前页附近的页码，或者在独立按钮不显示时显示第一/最后一页
							return nearCurrentPage || number === 1 || number === totalPages;
						}).map((number) => (
							<button
								key={number}
								onClick={() => onPageChange(number)}
								className={`w-8 h-8 rounded flex items-center justify-center ${currentPage === number
									? "bg-blue-600 text-white"
									: "bg-gray-200 hover:bg-gray-300"
									}`}
							>
								{number}
							</button>
						))}

						{/* 显示最后一页 */}
						{totalPages > 7 && currentPage < totalPages - 2 && (
							<>
								{/* 省略号 */}
								{currentPage < totalPages - 3 && (
									<span className="w-8 h-8 flex items-center justify-center">...</span>
								)}
								<button
									onClick={() => onPageChange(totalPages)}
									className="w-8 h-8 rounded flex items-center justify-center bg-gray-200 hover:bg-gray-300"
								>
									{totalPages}
								</button>
							</>
						)}
					</div>

					<button
						onClick={() => onPageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className={`px-3 py-1 rounded ${currentPage === totalPages
							? "bg-gray-200 text-gray-400"
							: "bg-blue-500 text-white hover:bg-blue-600"
							}`}
					>
						下一页
					</button>
				</div>
			</div>
		</div>
	);
};

export default CommitList;
