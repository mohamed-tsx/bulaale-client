'use client';

import React from 'react';
import { useI18n } from '@/lib/contexts/i18n-context';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Globe } from 'lucide-react';
import Image from 'next/image';

interface LanguageSwitcherProps {
  variant?: 'button' | 'select';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  variant = 'select',
  className = ''
}) => {
  const { language, setLanguage, isLoading } = useI18n();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', icon: "https://flagcdn.com/us.svg" },
    { code: 'so', name: 'Soomaali', flag: '🇸🇴', icon: "https://flagcdn.com/so.svg" }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 animate-spin" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLanguage(lang.code as 'en' | 'so')}
            className="flex items-center justify-center w-10 h-10 p-0"
            title={lang.name}
          >
            <span className="text-lg">{lang.flag}</span>
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'so')}>
        <SelectTrigger className="w-[60px]">
          <SelectValue>
            <span className="text-lg">
              <Image
                src={languages.find(lang => lang.code === language)?.icon ?? ""}
                alt="language flag"
                width={16}
                height={16}
              />
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
                <Image src={lang.icon} alt={lang.name} width={16} height={16} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
