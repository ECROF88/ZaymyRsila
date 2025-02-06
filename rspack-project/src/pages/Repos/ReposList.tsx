// src/components/Repos/RepoList.tsx
import React from 'react';
import { List, Typography, Divider } from 'antd';
import useRepoData from './hooks/useRepoData';

const { Title } = Typography;

const ReposList: React.FC = () => {
  const { repos, selectedRepo, setSelectedRepo } = useRepoData();

  return (
    <div>
      <Title level={4} style={{ padding: '16px' }}>
        仓库列表
      </Title>
      <Divider style={{ marginTop: 0, marginBottom: 0 }} />
      <List
        itemLayout="horizontal"
        dataSource={repos}
        renderItem={(repo) => (
          <List.Item
            key={repo.id}
            onClick={() => {
              setSelectedRepo(repo);
              console.log('选了新仓库', selectedRepo);
            }}
            style={{
              cursor: 'pointer',
              background:
                selectedRepo?.id === repo.id ? '#8A7F43FF' : 'transparent',
              paddingLeft: '24px',
            }}
          >
            <List.Item.Meta title={repo.name} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ReposList;
