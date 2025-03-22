'use client';
import { useEffect, useState } from 'react';
import { Card, Button, Typography, Spin } from 'antd';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

export default function CandidateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  interface Profile {
    name: string;
    email: string;
    coverLetter: string;
    cvUrl: string;
  }

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/candidate/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data?.candidate);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isPDF = profile?.cvUrl?.endsWith('.pdf');

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 24 }}>
      <Title level={2}>Mon profil</Title>

      {loading ? (
        <Spin />
      ) : profile ? (
        <>
          <Card title="Informations personnelles" style={{ marginBottom: 24 }}>
            <Paragraph><strong>Nom :</strong> {profile.name || 'Non renseigné'}</Paragraph>
            <Paragraph><strong>Email :</strong> {profile.email || 'Non renseigné'}</Paragraph>
          </Card>

          <Card title="Lettre de motivation" style={{ marginBottom: 24 }}>
            <Paragraph>{profile.coverLetter || 'Non renseignée'}</Paragraph>
          </Card>

          <Card title="Mon CV">
            {profile.cvUrl ? (
              isPDF ? (
                <iframe
                  src={profile.cvUrl}
                  width="100%"
                  height="600px"
                  style={{ borderRadius: 8 }}
                />
              ) : (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer">
                  Télécharger mon CV
                </a>
              )
            ) : (
              <Paragraph>Aucun CV uploadé.</Paragraph>
            )}
          </Card>

          <div style={{ marginTop: 32 }}>
            <Button type="primary" onClick={() => router.push('./dashboard/update')}>
              Modifier mes informations
            </Button>
          </div>
        </>
      ) : (
        <Paragraph>Impossible de charger votre profil.</Paragraph>
      )}
    </div>
  );
}
