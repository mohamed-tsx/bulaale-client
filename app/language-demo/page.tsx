'use client';

import { useI18n, useTranslation } from '@/lib/contexts/i18n-context';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LanguageDemoPage() {
  const { language, setLanguage } = useI18n();
  const t = useTranslation();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>🌍 Language Switching Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current Language Display */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Language:</h3>
            <p className="text-2xl font-bold text-blue-600">
              {language === 'en' ? '🇺🇸 English' : '🇸🇴 Soomaali'}
            </p>
          </div>

          {/* Method 1: Language Switcher Component */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Method 1: Language Switcher Component</h3>
            <div className="flex gap-4 items-center">
              <span>Select variant:</span>
              <LanguageSwitcher variant="select" />
              <LanguageSwitcher variant="button" />
            </div>
          </div>

          {/* Method 2: Direct Button Switching */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Method 2: Direct Button Switching</h3>
            <div className="flex gap-4">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'}
                onClick={() => setLanguage('en')}
              >
                🇺🇸 English
              </Button>
              <Button 
                variant={language === 'so' ? 'default' : 'outline'}
                onClick={() => setLanguage('so')}
              >
                🇸🇴 Soomaali
              </Button>
            </div>
          </div>

          {/* Method 3: Programmatic Switching */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Method 3: Programmatic Switching</h3>
            <div className="flex gap-4">
              <Button 
                variant="secondary"
                onClick={() => setLanguage('en')}
              >
                Switch to English
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setLanguage('so')}
              >
                Switch to Somali
              </Button>
            </div>
          </div>

          {/* Translation Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Translation Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Common Phrases:</h4>
                <p><strong>Hello:</strong> {t('common.loading')}</p>
                <p><strong>Save:</strong> {t('common.save')}</p>
                <p><strong>Total:</strong> {t('common.total')}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Checkout Phrases:</h4>
                <p><strong>Shipping:</strong> {t('checkout.shippingInformation')}</p>
                <p><strong>Payment:</strong> {t('checkout.paymentInformation')}</p>
                <p><strong>Order:</strong> {t('checkout.placeOrder')}</p>
              </div>
            </div>
          </div>

          {/* Parameter Examples */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Translation with Parameters</h3>
            <div className="p-4 bg-green-50 rounded-lg">
              <p><strong>Order Success:</strong> {t('checkout.orderPlacedSuccessfullyWithNumber', { orderNumber: 'BB-2024-001' })}</p>
              <p><strong>Savings:</strong> {t('checkout.totals.youSave', { amount: '25.50' })}</p>
              <p><strong>Percentage:</strong> {t('checkout.totals.savingPercentage', { percentage: '15.5' })}</p>
            </div>
          </div>

          {/* Language Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Language Information:</h3>
            <ul className="space-y-1 text-sm">
              <li>• Language preference is saved in localStorage</li>
              <li>• Language persists across browser sessions</li>
              <li>• Falls back to English if translation fails</li>
              <li>• All text updates automatically when language changes</li>
            </ul>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
