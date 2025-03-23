'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Spin, Button, message } from 'antd';
import { useTranslations } from 'next-intl';

const { Title, Paragraph } = Typography;

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('candidateDetail');

  const id = params?.id as string;

  const [candidate, setCandidate] = useState<{
    name: string;
    email: string;
    coverLetter?: string;
    additionalInfo?: string;
    cvUrl?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await fetch(`/api/candidates/${id}`);
        const data = await res.json();
        if (!res.ok) {
          message.error(data.error || t('fetchError'));
        } else {
          setCandidate(data.candidate);
        }
      } catch (err) {
        message.error(t('fetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id, t]);

  if (loading) return <Spin />;
  if (!candidate) return <p>{t('notFound')}</p>;

  const isPDF = candidate.cvUrl?.endsWith('.pdf');

  return (
    <div style={{ padding: 24 }}>
      <Button
        type="default"
        onClick={() => params && router.push(`/${params.locale}/recruteur/candidats`)}
        style={{ marginBottom: 16 }}
      >
        ← {t('backToList')}
      </Button>

      <Title level={2}>{t('title', { name: candidate.name })}</Title>

      <Card title={t('personalInfo')} style={{ marginBottom: 24 }}>
        <Paragraph><strong>{t('name')} :</strong> {candidate.name}</Paragraph>
        <Paragraph><strong>{t('email')} :</strong> {candidate.email}</Paragraph>
      </Card>

      <Card title={t('coverLetter')} style={{ marginBottom: 24 }}>
        <Paragraph>{candidate.coverLetter || t('notProvided')}</Paragraph>
      </Card>

      <Card title={t('additionalInfo')} style={{ marginBottom: 24 }}>
        <Paragraph>{candidate.additionalInfo || t('notProvided')}</Paragraph>
      </Card>

      <Card title="CV">
        {candidate.cvUrl ? (
          isPDF ? (
            <iframe
              src={candidate.cvUrl}
              width="100%"
              height="600px"
              style={{ borderRadius: 8 }}
            />
          ) : (
            <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
              {t('downloadCV')}
            </a>
          )
        ) : (
          <Paragraph>{t('noCV')}</Paragraph>
        )}
      </Card>
    </div>
  );
}
