import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Space } from 'antd';

const { Title } = Typography;

// Example user data
const initialUsers = [
  { key: 1, name: 'Alice', email: 'alice@example.com' },
  { key: 2, name: 'Bob', email: 'bob@example.com' },
  { key: 3, name: 'Charlie', email: 'charlie@example.com' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      setUsers(users.map(user => user.key === editingUser.key ? { ...user, ...values } : user));
      setIsModalOpen(false);
      setEditingUser(null);
      form.resetFields();
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <b>{text}</b>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => showEditModal(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>User Management</Title>
      <Table columns={columns} dataSource={users} bordered />

      <Modal
        title="Edit User"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input the user name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;