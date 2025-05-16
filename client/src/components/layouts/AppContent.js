import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const AppContent = ({ children }) => (
  <Content style={{ padding: '32px 16px', flex: 1 }}>
    {children}
  </Content>
);

export default AppContent;