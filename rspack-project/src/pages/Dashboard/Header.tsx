import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const HeaderContent: React.FC = () => {
  return (
    <Header style={{ background: '#fff', padding: '0 24px' }}>
      <h2>欢迎来到管理系统</h2>
    </Header>
  );
};

export default HeaderContent;
