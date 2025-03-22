// app/[locale]/candidat/[id]/page.tsx
'use client';
import { Descriptions, Button, message } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface Candidate {
  id: number;
  name: string;
  email: string;
  // Autres champs si nécessaire
}

export default function CandidateDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const t = useTranslations('candidateDetail');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCandidateDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/candidates/${id}`); // Endpoint à implémenter
      const result = await res.json();
      if (!res.ok) {
        message.error(result.error || t('fetchError'));
      } else {
        setCandidate(result.candidate);
      }
    } catch (err) {
      message.error(t('fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchCandidateDetail();
  }, [id]);

  if (loading || !candidate) return <div>{t('loading')}</div>;

  return (
    <div style={{ padding: 24 }}>
      <Button onClick={() => router.back()}>{t('back')}</Button>
      <h1>{t('title')}</h1>
      <Descriptions bordered>
        <Descriptions.Item label={t('name')}>{candidate.name}</Descriptions.Item>
        <Descriptions.Item label={t('email')}>{candidate.email}</Descriptions.Item>
        {/* Autres champs */}
      </Descriptions>
    </div>
  );
}
