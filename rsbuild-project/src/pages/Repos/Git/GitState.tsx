import type { Repo } from "../../../utils/store";
import type {
	CommitDetail,
	CommitFileChange,
	GitCommit,
	ParsedDiff,
} from "./types";
import type React from "react";
import { useEffect, useState } from "react";
import { getGitCommitDetail, getGitHistory } from "../../../utils/api";
import useRepoData from "../hooks/useRepoData";
import CommitList from "./CommitList";
import DiffView from "./DiffView";
import { parseDiff } from "./utils";

interface GitStateProps {
	repo: Repo;
}

const GitState: React.FC<GitStateProps> = ({ repo }) => {
	const [commits, setCommits] = useState<GitCommit[]>([]);
	const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
	const [commitDetail, setCommitDetail] = useState<CommitDetail | null>(null);
	const [loading, setLoading] = useState(false);
	const { setDiffContent: setEditorDiffContent } = useRepoData();

	useEffect(() => {
		if (repo) {
			loadGitHistory();
		}
	}, [repo]);

	const loadGitHistory = async () => {
		try {
			setLoading(true);
			const response = await getGitHistory(repo.id);
			setCommits(response.data.data);
		} catch (error) {
			console.error("加载Git历史失败:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCommitSelect = async (hash: string) => {
		try {
			setLoading(true);
			const response = await getGitCommitDetail(repo.id, hash);
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
		// const parsedDiff = { content: fileChange.diff } as ParsedDiff; // 简化处理，实际项目可能需要解析diff
		const parsedDiff = parseDiff(fileChange.diff);
		setEditorDiffContent(parsedDiff, fileChange.path);
	};

	return (
		<div className="flex h-full gap-2 p-2 bg-gradient-to-br from-blue-100 to-indigo-50 overflow-hidden">
			<CommitList
				commits={commits}
				selectedCommit={selectedCommit}
				onSelectCommit={handleCommitSelect}
				loading={loading}
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
