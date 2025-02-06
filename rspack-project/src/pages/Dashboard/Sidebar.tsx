import React from 'react';
import { Layout, Menu } from 'antd';
import {
  ApartmentOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '主页',
      path: '/dashboard/home', // 添加 path 属性
    },
    {
      key: 'user',
      icon: <UserOutlined />,
      label: '用户信息',
      path: '/dashboard/userinfo', // 添加 path 属性
    },
    {
      key: 'repos',
      icon: <ApartmentOutlined />,
      label: '我的仓库',
      path: '/dashboard/repos', // 添加 path 属性
    },
  ];

  //根据当前的路由确定默认选择的key
  const currentPath = location.pathname;
  const defaultSelectedKey =
    menuItems.find((item) => currentPath.startsWith(item.path))?.key || 'home';

  const handleMenuClick = (key: string) => {
    const menuItem = menuItems.find((item) => item.key === key);
    if (menuItem) {
      navigate(menuItem.path);
    }
  };

  return (
    <Sider width={200} theme="light">
      <div style={{ height: '64px', padding: '16px', textAlign: 'center' }}>
        <h2>管理系统</h2>
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={[defaultSelectedKey]} // 使用计算出的 key
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
      />
    </Sider>
  );
};

export default Sidebar;
