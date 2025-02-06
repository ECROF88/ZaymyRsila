import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

const DashboardLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <Header />
        <Content
          // style={{ margin: '24px 16px', padding: '24px', background: '#fff' }}
          className="m-6 p-6 bg-auto"
        >
          <Outlet /> {/* 渲染匹配的子路由组件 */}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
