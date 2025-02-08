import React from 'react';
import { DiffContent } from './types';

interface DiffViewProps {
  diffContent: DiffContent | null;
  selectedCommit: string | null;
}

const DiffView: React.FC<DiffViewProps> = ({ diffContent, selectedCommit }) => {
  return (
    <div className="w-full flex flex-col h-full bg-white rounded-lg shadow-lg border border-indigo-100">
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
  );
};

export default DiffView;
