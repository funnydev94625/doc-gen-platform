import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const { Content } = Layout;

const MainLayout = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <AppHeader />
    <Content style={{ padding: '32px 16px', flex: 1 }}>
      <Outlet />
    </Content>
    <AppFooter />
  </Layout>
);

export default MainLayout;