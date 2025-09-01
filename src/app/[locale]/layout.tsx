import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ClerkProvider } from '@clerk/nextjs';
import { Header } from '@/components/Header';
import './globals.css';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="min-h-screen bg-gray-50">
        <ClerkProvider>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main>
              {children}
            </main>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
