import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => (
  <Footer
    style={{
      textAlign: 'center',
      background: 'linear-gradient(90deg, #1890ff, #40a9ff)',
      color: '#fff',
      padding: '20px 0',
    }}
  >
    <p style={{ margin: 0, fontSize: '16px' }}>
      DocGen ©{new Date().getFullYear()} | All Rights Reserved
    </p>
  </Footer>
);

export default AppFooter;