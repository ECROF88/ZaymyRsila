// src/components/Repos/ReposLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import RepoList from './ReposList';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import GitState from './GitState';
import useRepoData from './hooks/useRepoData';

const { Sider, Content } = Layout;

const ReposLayout: React.FC = () => {
  const { selectedRepo } = useRepoData();

  return (
    <Layout className="h-[calc(100vh-100px)]">
      <Sider width={250} theme="light" className="overflow-auto">
        <RepoList />
      </Sider>
      <Layout>
        <Content className="p-2 overflow-auto min-h-screen">
          {selectedRepo ? (
            <div className="flex h-full">
              <div className="flex-none w-[300px] mr-4 border-r border-gray-200">
                <FileTree />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 mb-1">
                  <CodeEditor />
                </div>
                <div className="h-[300px]">
                  <GitState repo={selectedRepo} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              请选择一个仓库和文件。
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ReposLayout;
