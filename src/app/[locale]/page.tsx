"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Brain, 
  BarChart3, 
  CreditCard, 
  Receipt,
  Zap,
  Target,
  Mail,
  Smartphone,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const t = useTranslations('home');
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const switchLanguage = (locale: string) => {
    const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, "");
    const newPath = `/${locale}${pathWithoutLocale || ""}`;
    router.push(newPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Finance</span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => switchLanguage(language.code)}
                    className="flex items-center gap-2"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link href="/dashboard">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            {t('hero.badge')}
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('hero.title')}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> {t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                {t('hero.cta')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>{t('features.receiptScanner.title')}</CardTitle>
              <CardDescription>
                {t('features.receiptScanner.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>{t('features.analytics.title')}</CardTitle>
              <CardDescription>
                {t('features.analytics.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>{t('features.budget.title')}</CardTitle>
              <CardDescription>
                {t('features.budget.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>{t('features.expense.title')}</CardTitle>
              <CardDescription>
                {t('features.expense.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>{t('features.reports.title')}</CardTitle>
              <CardDescription>
                {t('features.reports.description')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <CardTitle>{t('features.security.title')}</CardTitle>
              <CardDescription>
                {t('features.security.description')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90">
              {t('cta.subtitle')}
            </p>
            <div className="flex justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  {t('cta.button')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Finance</span>
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-blue-400 transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-blue-400 transition-colors">{t('footer.support')}</a>
              <a href="#" className="hover:text-blue-400 transition-colors">{t('footer.contact')}</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
