import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

const { Content } = Layout;

const AuthLayout = () => (
  <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
    <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Outlet />
    </Content>
  </Layout>
);

export default AuthLayout;