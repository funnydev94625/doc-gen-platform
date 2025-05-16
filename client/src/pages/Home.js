import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

const features = [
  { id: 1, title: 'Document Generation', description: 'Easily create professional documents with customizable templates.' },
  { id: 2, title: 'Template Management', description: 'Organize and manage your templates efficiently.' },
  { id: 3, title: 'Collaboration Tools', description: 'Collaborate with your team in real-time on document creation.' },
  { id: 4, title: 'Secure Storage', description: 'Store your documents securely with advanced encryption.' },
];

const Home = () => {
  return (
    <div
      style={{
        padding: 24,
        backgroundImage: 'url("/assets/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        color: '#fff',
      }}
    >
      <Title level={1} style={{ textAlign: 'center', color: '#fff', marginBottom: 24 }}>
        Welcome to Doc-Gen Platform
      </Title>
      <Paragraph style={{ textAlign: 'center', fontSize: '18px', marginBottom: 40 }}>
        Streamline your document creation and management with our powerful tools and intuitive interface.
      </Paragraph>
      <Row gutter={[24, 24]}>
        {features.map(feature => (
          <Col xs={24} sm={12} md={8} lg={6} key={feature.id}>
            <Card
              title={feature.title}
              bordered={false}
              hoverable
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            >
              <p>{feature.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <Button type="primary" size="large" style={{ borderRadius: '8px' }}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Home;