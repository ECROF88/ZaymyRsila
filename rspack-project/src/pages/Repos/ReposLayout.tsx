// src/components/Repos/ReposLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import RepoList from './ReposList';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import GitState from './Git/GitState';
import useRepoData from './hooks/useRepoData';

const { Sider, Content } = Layout;

const ReposLayout: React.FC = () => {
  const { selectedRepo } = useRepoData();

  return (
    <Layout className="h-[calc(100vh-100px)]">
      <Sider width={250} theme="light" className="overflow-auto">
        <RepoList />
      </Sider>
      <div className="w-full">
        <Content className="p-1 overflow-auto">
          {selectedRepo ? (
            <div className="flex ">
              <div className="flex-none w-[250px] mr-4 border-r border-gray-200">
                <FileTree />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex-1 mb-1">
                  <CodeEditor />
                </div>
                <div className="h-[40svh]">
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
      </div>
    </Layout>
  );
};

export default ReposLayout;
