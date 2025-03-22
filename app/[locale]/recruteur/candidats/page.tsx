'use client';
import { Table, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

interface Candidate {
  id: number;
  name: string;
  email: string;
}

export default function CandidateListPage() {
  const [data, setData] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('candidateList');
  const router = useRouter();

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/candidates');
      const result = await res.json();
      if (!res.ok) {
        message.error(result.error || t('fetchError'));
      } else {
        setData(result.candidates);
      }
    } catch (err) {
      message.error(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_: any, record: Candidate) => (
        <Button type="link" onClick={() => router.push(`/recruteur/candidats/${record.id}`)}>
          {t('view')}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>{t('title')}</h1>
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}
