'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Button, Space, Card } from 'antd';

const { Title } = Typography;

export default function LanguageChoicePage() {
  const [locale, setLocale] = useState('en');
  const router = useRouter();

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    router.push(`/${newLocale}`);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Card style={{ padding: 32, minWidth: 300, textAlign: 'center', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Title level={3}>
          {locale === 'en' ? 'Language Choice' : 'Choix de langue'}
        </Title>
        <Space direction="vertical" size="middle" style={{ marginTop: 24 }}>
          <Button type="primary" onClick={() => changeLocale('en')} block>
            English
          </Button>
          <Button onClick={() => changeLocale('fr')} block>
            Français
          </Button>
        </Space>
      </Card>
    </div>
  );
}
