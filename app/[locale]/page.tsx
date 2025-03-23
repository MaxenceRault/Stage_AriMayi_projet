'use client';
import { Button, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations('home');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <h1>{t('welcome')}</h1>
      <Space size="large">
        <Button type="primary" onClick={() => router.push(`/${t('locale')}/candidat/register`)}>
          {t('candidateButton')}
        </Button>
        <Button onClick={() => router.push(`/${t('locale')}/recruteur/candidats`)}>
          {t('recruiterButton')}
        </Button>
      </Space>
    </div>
  );
}
