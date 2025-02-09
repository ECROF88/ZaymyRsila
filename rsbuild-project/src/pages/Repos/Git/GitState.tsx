import React, { useEffect, useState } from 'react';
import { getGitHistory, getGitDiff } from '../../../utils/api';
import { Repo } from '../../../utils/store';
import useRepoData from '../hooks/useRepoData';
import { GitCommit, DiffContent, ParsedDiff } from './types';
import CommitList from './CommitList';
import DiffView from './DiffView';

interface GitStateProps {
  repo: Repo;
}

const GitState: React.FC<GitStateProps> = ({ repo }) => {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [diffContent, setLocalDiffContent] = useState<DiffContent | null>(null);
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
      // todo()! repo.url to get commitList from backend
      const response = await getGitHistory(repo.id);
      setCommits(response.data.data);
    } catch (error) {
      console.error('加载Git历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommitSelect = async (hash: string) => {
    try {
      setLoading(true);
      const response = await getGitDiff(repo.id, hash);
      setLocalDiffContent(response.data.data);
      setSelectedCommit(hash);
    } catch (error) {
      console.error('加载差异信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInEditor = (diff: ParsedDiff, fileName: string) => {
    setEditorDiffContent(diff, fileName);
  };

  return (
    <div className="flex h-full gap-2 p-2 bg-gradient-to-br from-blue-100 to-indigo-50">
      <CommitList
        commits={commits}
        selectedCommit={selectedCommit}
        onSelectCommit={handleCommitSelect}
        onViewInEditor={handleViewInEditor}
        loading={loading}
        diffContent={diffContent}
      />
      <DiffView diffContent={diffContent} selectedCommit={selectedCommit} />
    </div>
  );
};

export default GitState;
