'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, Typography, Spin, message } from 'antd';

const { Title, Paragraph } = Typography;

export default function CandidateDetailPage() {
  const params = useParams();
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
          message.error(data.error || 'Erreur serveur');
        } else {
          setCandidate(data.candidate);
        }
      } catch (err) {
        message.error('Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate(); // ✅ ici !
  }, [id]);

  if (loading) return <Spin />;
  if (!candidate) return <p>Candidat introuvable.</p>;

  const isPDF = candidate.cvUrl?.endsWith('.pdf');

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Profil de {candidate.name}</Title>

      <Card title="Informations personnelles" style={{ marginBottom: 24 }}>
        <Paragraph><strong>Nom :</strong> {candidate.name}</Paragraph>
        <Paragraph><strong>Email :</strong> {candidate.email}</Paragraph>
      </Card>

      <Card title="Lettre de motivation" style={{ marginBottom: 24 }}>
        <Paragraph>{candidate.coverLetter || 'Non renseignée'}</Paragraph>
      </Card>

      <Card title="Infos supplémentaires" style={{ marginBottom: 24 }}>
        <Paragraph>{candidate.additionalInfo || 'Non renseignées'}</Paragraph>
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
              Télécharger le CV
            </a>
          )
        ) : (
          <Paragraph>Aucun CV disponible.</Paragraph>
        )}
      </Card>
    </div>
  );
}
// Compare this snippet from app/%5Blocale%5D/candidat/dashboard/page.tsx: