import type { GitCommit } from "./types";
import React from "react";

interface CommitListProps {
	commits: GitCommit[];
	selectedCommit: string | null;
	onSelectCommit: (hash: string) => void;
	loading: boolean;
}

const CommitList: React.FC<CommitListProps> = ({
	commits,
	selectedCommit,
	onSelectCommit,
	loading,
}) => {
	const formatDate = (timestamp: number) => {
		const date = new Date(timestamp * 1000);
		return date.toLocaleString();
	};

	return (
		<div className="w-full max-w-[20svw] flex flex-col h-full bg-white rounded-lg shadow-lg border border-indigo-100">
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
								className={`p-4 cursor-pointer transition-colors ${
									selectedCommit === commit.id
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
			</div>
		</div>
	);
};

export default CommitList;
