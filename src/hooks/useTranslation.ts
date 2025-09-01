"use client";

import { useState, useEffect } from 'react';
import enMessages from '../../messages/en.json';
import arMessages from '../../messages/ar.json';

const messages = {
  en: enMessages,
  ar: arMessages,
};

export function useTranslation() {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

  const t = (key: string, namespace?: string) => {
    const currentMessages = messages[locale as keyof typeof messages];
    
    if (namespace) {
      const namespaceMessages = currentMessages[namespace as keyof typeof currentMessages];
      if (typeof namespaceMessages === 'object' && namespaceMessages !== null) {
        return (namespaceMessages as any)[key] || key;
      }
    }
    
    // Try to find the key in the entire messages object
    const findKey = (obj: any, searchKey: string): string => {
      for (const [k, v] of Object.entries(obj)) {
        if (k === searchKey) {
          return v as string;
        }
        if (typeof v === 'object' && v !== null) {
          const result = findKey(v, searchKey);
          if (result !== searchKey) {
            return result;
          }
        }
      }
      return searchKey;
    };
    
    return findKey(currentMessages, key);
  };

  return { t, locale };
}
