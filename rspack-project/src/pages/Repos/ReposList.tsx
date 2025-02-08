import React, { useState } from 'react';
import { Typography, Divider, Button, MenuProps } from 'antd';
import useRepoData from './hooks/useRepoData';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import AddRepos from './AddRepos';
import EditRepos from './EdiRepos';
import DropdownMenu from '../../component/DropdownMenu';
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
        >
          添加仓库
        </Button>
      </div>
      <Divider className="my-0" />
      <DropdownMenu
        dataSource={repos}
        selectedItem={selectedRepo}
        onItemSelect={setSelectedRepo}
        menuItems={items}
        onMenuClick={(key, item) => {
          if (key === 'edit') {
            setIsEditOpen(true);
          } else if (key === 'delete') {
            console.log('delete', item);
          }
        }}
      />
      <EditRepos isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />
      <AddRepos isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default ReposList;
