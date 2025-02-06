// src/components/Repos/RepoList.tsx
import React, { useState } from 'react';
import {
  List,
  Typography,
  Divider,
  Button,
  Dropdown,
  MenuProps,
  message,
} from 'antd';
import useRepoData from './hooks/useRepoData';
import {
  PlusOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  EditOutlined,
} from '@ant-design/icons';
import AddRepos from './AddRepos';
import EditRepos from './EdiRepos';
const { Title } = Typography;
const items: MenuProps['items'] = [
  {
    key: 'edit',
    icon: <EditOutlined />,
    label: '编辑',
  },
  {
    key: 'delete',
    icon: <DeleteOutlined />,
    label: '删除',
    danger: true,
  },
];

const ReposList: React.FC = () => {
  const { repos, selectedRepo, setSelectedRepo } = useRepoData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'edit') {
      console.log('edit');
      setIsEditOpen(true);
      // todo edit
    } else if (e.key === 'delete') {
      // todo delete
      console.log('delete');
    }
  };
  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="flex flex-col h-full">
      <Title level={5} className="p-2">
        仓库列表
      </Title>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          添加仓库
        </Button>
      </div>
      <Divider className="my-0" />
      <List
        dataSource={repos}
        // className="flex-1"
        className="flex-auto"
        renderItem={(repo) => (
          <List.Item
            key={repo.id}
            onClick={(e) => {
              // 防止点击下拉菜单时触发选择仓库
              if (!(e.target as HTMLElement).closest('.ant-dropdown-trigger')) {
                setSelectedRepo(repo);
              }
            }}
            className={`
        border-amber-100
        border-2
        px-6 py-3 
        cursor-pointer 
        transition-all duration-200 ease-in-out
        hover:bg-gray-100
        ${
          selectedRepo?.id === repo.id
            ? 'bg-green-100 border-l-4 border-green-500'
            : 'hover:border-l-6 hover:border-gray-300'
        }
      `}
            actions={[
              <Dropdown key="more" trigger={['click']} menu={menuProps}>
                <EllipsisOutlined className="text-gray-500 hover:text-gray-700" />
              </Dropdown>,
            ]}
          >
            <List.Item.Meta
              title={
                <span
                  className={`
            font-medium
            ${selectedRepo?.id === repo.id ? 'text-green-700' : 'text-gray-700'}
          `}
                >
                  {repo.name}
                </span>
              }
            />
          </List.Item>
        )}
      />
      <EditRepos isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
      <AddRepos isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default ReposList;
