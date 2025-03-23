'use client';
import { Form, Input, Button, message } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function CandidateRegisterPage() {
    const router = useRouter();
    const t = useTranslations('candidateRegister');

    const onFinish = async (values: any) => {
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values), // pas de champ "role"
            });
            const data = await res.json();
            if (!res.ok) {
                message.error(data.error || t('error'));
            } else {
                message.success(t('success'));
                
                // ✅ Stocker le token
                localStorage.setItem('token', data.token);
                
                router.push(`/${t('locale')}/candidat/dashboard`);
            }
        } catch (err) {
            message.error(t('error'));
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 24 }}>
            <h1>{t('title')}</h1>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label={t('name')}
                    name="name"
                    rules={[{ required: true, message: t('nameRequired') }]}
                >
                    <Input />
                </Form.Item>
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
                    <Button type="primary" htmlType="submit">
                        {t('submit')}
                    </Button>
                </Form.Item>
            </Form>
            <p style={{ textAlign: 'center', marginTop: 16 }}>
                <Link href={`/${t('locale')}/candidat/login`}>
                    {t('Redirect')}
                </Link>
            </p>
        </div>
    );
}
