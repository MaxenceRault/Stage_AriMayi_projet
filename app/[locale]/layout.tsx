// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import React from 'react';
import Providers from './providers'; // 🆕 ton Provider Redux

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: 'Plateforme de Recrutement',
    description: 'Bienvenue sur la plateforme de recrutement',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = (await import(`../../messages/${params.locale}.json`)).default;

  return (
    <html lang={params.locale}>
      <body>
        <Providers>
          <NextIntlClientProvider locale={params.locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
