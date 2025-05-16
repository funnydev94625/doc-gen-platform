import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = () => {
  const location = useLocation();
  // Determine selected menu item based on current path
  const selectedKeys = (() => {
    if (location.pathname.startsWith('/admin/templates')) return ['templates'];
    if (location.pathname.startsWith('/admin/users')) return ['users'];
    if (location.pathname.startsWith('/analyze')) return ['analyze'];
    if (location.pathname.startsWith('/auth/login')) return ['login'];
    if (location.pathname.startsWith('/auth/register')) return ['register'];
    return [];
  })();

  return (
    <Header style={{ background: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
      <div style={{ float: 'left', fontWeight: 'bold', fontSize: 20 }}>
        <Link to="/">DocGen</Link>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={selectedKeys}
        style={{ float: 'right' }}
      >
        <Menu.Item key="templates">
          <Link to="/admin/templates">Templates</Link>
        </Menu.Item>
        <Menu.Item key="users">
          <Link to="/admin/users">User Management</Link>
        </Menu.Item>
        <Menu.Item key="analyze">
          <Link to="/analyze">Analyze</Link>
        </Menu.Item>
        <Menu.Item key="login">
          <Link to="/auth/login">Login</Link>
        </Menu.Item>
        <Menu.Item key="register">
          <Link to="/auth/register">Register</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default AppHeader;