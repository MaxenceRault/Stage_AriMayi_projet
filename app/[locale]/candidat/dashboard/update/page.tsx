'use client';
import { Form, Input, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function CandidateDashboardUpdate() {
  const t = useTranslations('candidateDashboard');
  const [form] = Form.useForm();
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleUploadChange = async (info: any) => {
    if (info.file.status === 'done') {
      const fileUrl = info?.file?.response?.url;

      if (!fileUrl) {
        return message.error(t('uploadError'));
      }

      setCvUrl(fileUrl);

      try {
        const res = await fetch('/api/candidate/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cvUrl: fileUrl }),
        });

        const data = await res.json();
        if (!res.ok) {
          message.error(data.error || t('uploadError'));
        } else {
          message.success(t('uploadSuccess'));
        }
      } catch (err) {
        console.error(err);
        message.error(t('uploadError'));
      }
    } else if (info.file.status === 'error') {
      message.error(t('uploadError'));
    }
  };

  const onFinish = async (values: any) => {
    if (!token) {
      return message.error('Utilisateur non authentifié');
    }

    const payload = { ...values };
    if (cvUrl) payload.cvUrl = cvUrl;

    try {
      const res = await fetch('/api/candidate/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        message.error(data.error || t('updateError'));
      } else {
        message.success(t('updateSuccess'));
      }
    } catch (err) {
      message.error(t('updateError'));
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
      <h1>{t('title')}</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label={t('additionalInfo')} name="additionalInfo">
          <Input.TextArea rows={4} placeholder={t('infoPlaceholder')} />
        </Form.Item>
        <Form.Item label={t('coverLetter')} name="coverLetter">
          <Input.TextArea rows={6} placeholder={t('coverLetterPlaceholder')} />
        </Form.Item>
        <Form.Item label={t('cv')}>
          <Upload
            name="cv"
            action="/api/upload-cv"
            headers={{ Authorization: `Bearer ${token}` }}
            showUploadList={false}
            maxCount={1}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>{t('uploadCV')}</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t('updateProfile')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
