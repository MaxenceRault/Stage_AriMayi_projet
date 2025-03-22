'use client';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function CandidateLoginPage() {
  const router = useRouter();
  const t = useTranslations('candidateLogin');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        message.error(data.error || t('error'));
      } else {
        message.success(t('success'));

        // ✅ Stocker le token dans le localStorage
        localStorage.setItem('token', data.token);

        // Redirection
        router.push(`/${t('locale')}/candidat/dashboard`);
      }
    } catch (err) {
      message.error(t('error'));
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
      <h1>{t('title')}</h1>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={t('email')}
          name="email"
          rules={[
            { required: true, message: t('emailRequired') },
            { type: 'email', message: t('emailInvalid') },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('password')}
          name="password"
          rules={[{ required: true, message: t('passwordRequired') }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
