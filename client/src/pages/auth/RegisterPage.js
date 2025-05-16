import React from 'react';
import { Form, Input, Button, Card, Typography, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Use AntD notification context holder
  const [api, contextHolder] = notification.useNotification();

  const handleRegister = (values) => {
    axios.post('/api/auth/register', values)
      .then(response => {
        api.success({
          message: 'Registration Successful',
          description: 'You have registered successfully!',
        });
        setTimeout(() => navigate('/auth/login'), 1200);
      })
      .catch(error => {
        api.error({
          message: 'Registration Failed',
          description: error?.response?.data?.msg || 'Please try again.',
        });
      });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      {contextHolder}
      <Card style={{ width: 400, boxShadow: '0 2px 8px #f0f1f2' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Register</Title>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' }
            ]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span>Already have an account? </span>
          <Link to="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;