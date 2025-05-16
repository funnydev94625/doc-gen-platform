import React from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const { Title } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Use AntD notification context holder
  const [api, contextHolder] = notification.useNotification();

  const handleLogin = async (values) => {
    try {
      // Example: replace with your real API call
      const res = await axios.post('/api/auth/login', values);
      login({ email: values.email, password: values.password }); // Example only
      api.success({
        message: 'Login Successful',
        description: 'Welcome back!',
      });
      setTimeout(() => navigate('/admin/users'), 1200);
    } catch (error) {
      api.error({
        message: 'Login Failed',
        description: error?.response?.data?.msg || 'Please try again.',
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      {contextHolder}
      <Card style={{ width: 350, boxShadow: '0 2px 8px #f0f1f2' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Login</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input
              type="email"
              placeholder="Enter your email"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Don't have an account? </span>
          <Link to="/register">Register</Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;