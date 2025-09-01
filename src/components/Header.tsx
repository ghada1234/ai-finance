"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrendingUp, Menu, X } from "lucide-react";
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from '@/hooks/useTranslation';

export function Header() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Finance</span>
          </Link>

          {/* Desktop Navigation */}
          {isSignedIn && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('dashboard', 'navigation')}
              </Link>
              <Link href="/transactions" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('transactions', 'navigation')}
              </Link>
              <Link href="/accounts" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('accounts', 'navigation')}
              </Link>
              <Link href="/budgets" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('budgets', 'navigation')}
              </Link>
              <Link href="/receipt-scanner" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('receiptScanner', 'navigation')}
              </Link>
              <Link href="/analytics" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('analytics', 'navigation')}
              </Link>
              <Link href="/reports" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('reports', 'navigation')}
              </Link>
              <Link href="/csv-import" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('csvImport', 'navigation')}
              </Link>
            </nav>
          )}

          {/* User Menu / Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher - Always Visible */}
            <LanguageSwitcher />
            
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || ""} />
                      <AvatarFallback>
                        {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.emailAddresses[0]?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">{t('dashboard', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/accounts">{t('accounts', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/transactions">{t('transactions', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/budgets">{t('budgets', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/receipt-scanner">{t('receiptScanner', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/analytics">{t('analytics', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reports">{t('reports', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/csv-import">{t('csvImport', 'navigation')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <SignOutButton>
                      <button className="w-full text-left">Log out</button>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SignInButton mode="modal">
                <Button disabled={!isLoaded}>
                  {isLoaded ? "Sign In" : "Loading..."}
                </Button>
              </SignInButton>
            )}

            {/* Mobile Menu Button */}
            {isSignedIn && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && isSignedIn && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/dashboard" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('dashboard', 'navigation')}
              </Link>
              <Link 
                href="/transactions" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('transactions', 'navigation')}
              </Link>
              <Link 
                href="/accounts" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('accounts', 'navigation')}
              </Link>
              <Link 
                href="/budgets" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('budgets', 'navigation')}
              </Link>
              <Link 
                href="/receipt-scanner" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('receiptScanner', 'navigation')}
              </Link>
              <Link 
                href="/analytics" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('analytics', 'navigation')}
              </Link>
              <Link 
                href="/reports" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('reports', 'navigation')}
              </Link>
              <Link 
                href="/csv-import" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('csvImport', 'navigation')}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
