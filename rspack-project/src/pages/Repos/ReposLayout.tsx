// src/components/Repos/ReposLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import RepoList from './ReposList';
import FileTree from './FileTree';
import CodeEditor from './CodeEditor';
import useRepoData from './hooks/useRepoData';

const { Sider, Content } = Layout;

const ReposLayout: React.FC = () => {
  const { selectedRepo } = useRepoData();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} theme="light" style={{ overflow: 'auto' }}>
        <RepoList />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', overflow: 'auto' }}>
          {selectedRepo ? (
            <div style={{ display: 'flex', height: '100%' }}>
              <div
                style={{
                  flex: '0 0 300px',
                  marginRight: '16px',
                  borderRight: '1px solid #f0f0f0',
                }}
              >
                <FileTree />
              </div>
              <div style={{ flex: 1 }}>
                <CodeEditor />
              </div>
            </div>
          ) : (
            <div>请选择一个仓库和文件。</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ReposLayout;
