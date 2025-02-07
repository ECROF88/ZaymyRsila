import React, { useEffect, useState } from 'react';
import { getGitHistory, getGitDiff } from '../../utils/api';
import { Repo } from '../../utils/store';

interface GitCommit {
  hash: string;
  author: string;
  date: string;
  message: string;
  changes: Array<{
    file: string;
    insertions: number;
    deletions: number;
  }>;
}

interface GitStateProp {
  repo: Repo;
}

const GitState: React.FC<GitStateProp> = ({ repo }) => {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [diffContent, setDiffContent] = useState<{
    diff: string;
    files: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

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
      console.error('加载Git历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDiff = async (hash: string) => {
    try {
      setLoading(true);
      const response = await getGitDiff(repo.id, hash);
      setDiffContent(response.data.data);
      setSelectedCommit(hash);
    } catch (error) {
      console.error('加载差异信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[500px] h-full gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* 提交历史侧 */}
      <div className="w-1/2 flex flex-col h-full bg-white rounded-lg shadow-lg border border-blue-100">
        <div className="p-4 border-b bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">提交历史</h2>
          <div className="text-sm text-blue-100 mt-1">
            {commits.length} 个提交记录
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {commits.map((commit) => (
            <div
              key={commit.hash}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedCommit === commit.hash
                  ? 'bg-blue-50 border-blue-300 shadow-md'
                  : 'hover:bg-indigo-50 border-gray-200 hover:border-indigo-200'
              }`}
              onClick={() => loadDiff(commit.hash)}
            >
              <div className="font-semibold text-gray-800">
                {commit.message}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {commit.author} · {new Date(commit.date).toLocaleString()}
              </div>
              <div className="text-sm font-mono bg-gray-50 px-2 py-1 rounded mt-2 text-indigo-500">
                {commit.hash.substring(0, 8)}
              </div>
              <div className="mt-3 space-y-1">
                <div className="text-sm text-gray-600">
                  修改文件: {commit.changes.length} 个
                </div>
                {commit.changes.map((change) => (
                  <div
                    key={change.file}
                    className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-500"
                  >
                    {change.file}
                    <span className="text-green-500 ml-1">
                      +{change.insertions}
                    </span>
                    <span className="text-red-500 ml-1">
                      -{change.deletions}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 差异详情侧 */}
      <div className="w-1/2 flex flex-col h-full bg-white rounded-lg shadow-lg border border-indigo-100">
        <div className="p-4 border-b bg-gradient-to-r from-indigo-500 to-purple-400 rounded-t-lg">
          <h2 className="text-xl font-bold text-white">差异详情</h2>
          {selectedCommit && (
            <div className="text-sm text-indigo-100 mt-1">
              提交哈希：{selectedCommit.substring(0, 8)}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {diffContent ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-indigo-800 mb-3">修改文件</h3>
                <ul className="space-y-2">
                  {diffContent.files.map((file) => (
                    <li
                      key={file}
                      className="text-sm bg-white px-3 py-2 rounded border border-indigo-100"
                    >
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
              <pre className="bg-gray-50 p-6 rounded-lg overflow-auto font-mono text-sm leading-relaxed border border-gray-200 shadow-inner">
                {diffContent.diff}
              </pre>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-3xl mb-2">👆</div>
              <div className="text-gray-400">选择左侧提交查看详细变更</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GitState;
