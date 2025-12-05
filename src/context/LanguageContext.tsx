import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple translation dictionary for V1
const translations: Record<Language, Record<string, string>> = {
  tr: {
    welcomeTitle: 'Hoş Geldiniz',
    welcomeSubtitle: 'Cihaz kamerası ile iskeletinizi takip eder, eliniz ekranın %75’ini geçtiğinde otomatik screenshot alır.',
    start: 'Hadi Başlayalım!',
    introTitle: 'Ekran Görüntüsü İçin El Hareketi',
    introDesc: 'Elinizi ekranın %75’ine kadar götürünce ekran görüntüsü alınır.',
    continue: 'Devam Et',
    live: 'Canlı',
    handPosition: 'El Pozisyonu',
    thresholdExceeded: '✅ Eşik aşıldı! Ekran görüntüsü alınabilir.',
    needThreshold: 'Eşiğe ulaşmak için %75 gerekiyor.',
    showHand: 'Elinizi kameraya gösterin.',
    screenshots: 'Ekran Görüntüleri',
    cameraError: 'Kamera Hatası',
    permissionDenied: 'Kamera izni reddedildi',
    allowCamera: 'Kameraya İzin Ver',
    loadingAI: 'Yapay Zeka Yükleniyor...',
    modelError: 'Model yüklenemedi.',
    retry: 'Tekrar Dene',
    gestureControlTitle: 'Hareket Kontrolü',
    gestureControlDesc: 'El hareketleriyle otomatik ekran görüntüsü alın.',
    poseDetectionTitle: 'Poz Algılama',
    poseDetectionDesc: 'MediaPipe ile gerçek zamanlı iskelet takibi.',
    secureLocalTitle: 'Güvenli & Yerel',
    secureLocalDesc: 'Tüm işlemler cihazınızda gerçekleşir.',
    privacyPolicy: 'Gizlilik Politikası',
    termsOfService: 'Hizmet Şartları',
    howItWorks: 'Nasıl Çalışır?',
    calibrationGuide: 'Kalibrasyon Rehberi Çizimi',
    thresholdLabel: '%75 Eşik Değeri',
    appSubtitle: 'Mobil Vaka Çalışması',
  },
  en: {
    welcomeTitle: 'Welcome',
    welcomeSubtitle: 'Tracks your skeleton with device camera, takes automatic screenshot when your hand crosses 75% of the screen.',
    start: 'Let’s Get Started!',
    introTitle: 'Hand Gesture for Screenshot',
    introDesc: 'Screenshot is taken when your hand reaches 75% of the screen.',
    continue: 'Continue',
    live: 'Live',
    handPosition: 'Hand Position',
    thresholdExceeded: '✅ Threshold exceeded! Screenshot can be taken.',
    needThreshold: 'Need 75% to reach threshold.',
    showHand: 'Show your hand to the camera.',
    screenshots: 'Screenshots',
    cameraError: 'Camera Error',
    permissionDenied: 'Camera permission denied',
    allowCamera: 'Allow Camera',
    loadingAI: 'Loading AI...',
    modelError: 'Model loading failed.',
    retry: 'Retry',
    gestureControlTitle: 'Gesture Control',
    gestureControlDesc: 'Take screenshots automatically with hand gestures.',
    poseDetectionTitle: 'Pose Detection',
    poseDetectionDesc: 'Real-time skeleton tracking with MediaPipe.',
    secureLocalTitle: 'Secure & Local',
    secureLocalDesc: 'All processing happens on your device.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    howItWorks: 'How It Works?',
    calibrationGuide: 'Calibration Guide Illustration',
    thresholdLabel: '75% Threshold',
    appSubtitle: 'Mobile Case Study',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
