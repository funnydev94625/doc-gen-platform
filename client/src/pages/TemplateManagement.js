import React, { useState } from 'react';
import { Card, Row, Col, Button, Typography, Modal, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

const initialTemplates = [
  { id: 1, name: 'Invoice Template', description: 'A simple invoice template.' },
  { id: 2, name: 'Resume Template', description: 'A modern resume template.' },
];

const TemplateManagement = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showAddModal = () => {
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAdd = () => {
    form.validateFields().then(values => {
      setTemplates([
        ...templates,
        {
          id: templates.length + 1,
          name: values.name,
          description: values.description,
        },
      ]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center', color: '#1890ff' }}>
        Template Management
      </Title>
      <Row gutter={[24, 24]}>
        {templates.map(template => (
          <Col xs={24} sm={12} md={8} lg={6} key={template.id}>
            <Card
              title={template.name}
              bordered={false}
              hoverable
              style={{
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <p>{template.description}</p>
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            hoverable
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 150,
              border: '2px dashed #d9d9d9',
              borderRadius: '8px',
              background: '#fafafa',
            }}
            onClick={showAddModal}
          >
            <Button type="dashed" icon={<PlusOutlined />} size="large">
              Add New Template
            </Button>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Add New Template"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={handleCancel}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Template Name"
            name="name"
            rules={[{ required: true, message: 'Please input the template name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateManagement;