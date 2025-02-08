import React from 'react';
import { GitCommit, ParsedDiff } from './types';
import { parseDiff } from './utils';

interface CommitListProps {
  commits: GitCommit[];
  selectedCommit: string | null;
  onSelectCommit: (hash: string) => void;
  onViewInEditor: (diff: ParsedDiff, fileName: string) => void;
  loading: boolean;
  diffContent: {
    diff: string;
    files: string[];
  } | null;
}

const CommitList: React.FC<CommitListProps> = ({
  commits,
  selectedCommit,
  onSelectCommit,
  onViewInEditor,
  loading,
  diffContent,
}) => {
  return (
    <div className="w-full flex flex-col h-full bg-white rounded-lg shadow-lg border border-blue-100">
      <div className="p-4 border-b bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-lg">
        <h2 className="text-xl font-bold text-white">提交历史</h2>
        <div className="text-sm text-blue-100 mt-1">
          {commits.length} 个提交记录
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        {commits.map((commit) => (
          <div
            key={commit.hash}
            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
              selectedCommit === commit.hash
                ? 'bg-blue-50 border-blue-300 shadow-md'
                : 'hover:bg-indigo-50 border-gray-200 hover:border-indigo-200'
            }`}
            onClick={() => onSelectCommit(commit.hash)}
          >
            <div className="font-semibold text-gray-800">{commit.message}</div>
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
                  className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-500 flex justify-between items-center"
                >
                  <div>
                    {change.file}
                    <span className="text-green-500 ml-1">
                      +{change.insertions}
                    </span>
                    <span className="text-red-500 ml-1">
                      -{change.deletions}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (diffContent) {
                        onViewInEditor(
                          parseDiff(diffContent.diff),
                          change.file,
                        );
                      }
                    }}
                    className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    在编辑器中查看
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitList;
