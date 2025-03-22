// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata } from 'next';
import React from 'react';

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
  // Charge les messages de traduction pour la locale donnée (exemple: messages/fr.json)
  const messages = (await import(`../../messages/${params.locale}.json`)).default;

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
