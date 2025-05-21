import type { Repo } from "../../../utils/store";
import type {
	CommitDetail,
	CommitFileChange,
	CommitInfo,
} from "./types";
import type React from "react";
import { useEffect, useState } from "react";
import {
	getCommitHistories,
	getDiff,
	getRepoTotalCount,
} from "../../../utils/api";
import useRepoData from "../hooks/useRepoData";
import CommitList from "./CommitList";
import DiffView from "./DiffView";
import { parseDiff } from "./utils";

interface GitStateProps {
	repo: Repo;
}

const GitState: React.FC<GitStateProps> = ({ repo }) => {
	const [commits, setCommits] = useState<CommitInfo[]>([]);
	const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
	const [commitDetail, setCommitDetail] = useState<CommitDetail | null>(null);
	const [loading, setLoading] = useState(false);
	const { setDiffContent } = useRepoData();

	const [currentPage, setCurrentPage] = useState(1);
	const [totalCommits, setTotalCommits] = useState(0);
	const commitsPerPage = 5; // 每页显示5条记录

	useEffect(() => {
		if (repo) {
			setCommits([]);
			setSelectedCommit(null);
			setCommitDetail(null);
			fetchCommitHistories(1);

			setCurrentPage(1); // 重置页码
			fetchCommitsTotal(repo.name); // 获取总数
		} else {
			setCommits([]);
			setSelectedCommit(null);
			setCommitDetail(null);
		}
	}, [repo]);


	const fetchCommitsTotal = async (repo: string) => {

		try {
			const total_count = await getRepoTotalCount({ repo_name: repo });
			console.log("total count is", total_count.data.data)
			setTotalCommits(total_count.data.data);
		} catch (error) {
			console.log("fail to get total count");
		}
	}

	const fetchCommitHistories = async (n: number) => {
		console.log("fetching page is", n)
		try {
			setLoading(true);
			const response = await getCommitHistories({
				repo_name: repo.name,
				limit: commitsPerPage,
				page: n
			});
			setCommits(response.data.data);
			setCurrentPage(n);
		} catch (error) {
			console.error("加载示例commits出错:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCommitSelect = async (hash: string) => {
		try {
			setLoading(true);
			const response = await getDiff({ repo_name: repo.name, commit_id: hash });
			setCommitDetail(response.data.data);
			setSelectedCommit(hash);
		} catch (error) {
			console.error("加载差异信息失败:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleViewInEditor = (fileChange: CommitFileChange) => {
		// 将文件差异传递给编辑器
		const parsedDiff = parseDiff(fileChange.diff);
		setDiffContent(parsedDiff, fileChange.path);
	};

	// 处理页码变化
	const handlePageChange = (page: number) => {
		fetchCommitHistories(page);

	};

	return (
		<div className="flex h-full gap-2 p-2 bg-gradient-to-br from-blue-100 to-indigo-50 overflow-hidden">
			<CommitList
				commits={commits}
				selectedCommit={selectedCommit}
				onSelectCommit={handleCommitSelect}
				loading={loading}
				currentPage={currentPage}
				totalCommits={totalCommits}
				commitsPerPage={commitsPerPage}
				onPageChange={handlePageChange}
			/>
			<DiffView
				commitDetail={commitDetail}
				selectedCommit={selectedCommit}
				onViewInEditor={handleViewInEditor}
			/>
		</div>
	);
};

export default GitState;
