# DeepSport Mobil Case – Gesture-Based Screenshot App (React Native + Expo)

## 1. Overview

**DeepSport Mobil Case**, MediaPipe ve TensorFlow.js kullanarak **mobil cihaz kamerası** üzerinden gerçek zamanlı pose/iskelet takibi yapan ve kullanıcının eli ekran genişliğinin %75’ini geçtiğinde otomatik olarak ekran görüntüsü alan bir **React Native + Expo** uygulamasıdır.

Bu proje, web versiyonundaki çekirdek iş mantığını koruyarak mobil ortama uyarlanmıştır:

- Gesture tabanlı otomatik screenshot (el, ekranın %75’ini geçtiğinde tetiklenir)
- MediaPipe Pose ile iskelet overlay
- Screenshot galerisi
- TR/EN global dil desteği (LanguageContext)
- Kamera başlatma ve timeout problemlerine karşı güçlendirilmiş kamera servis mimarisi
- **Hem ön kamera hem de arka kamera desteği** (user/back kamera arasında geçiş)

Mobil versiyonda ekran akışı sadeleştirilmiş ve **3 ekrana** indirgenmiştir:

1. **WelcomeScreen**
2. **IntroCalibrationScreen**
3. **MainScreen**

---

## 2. Screens & Flow

### 2.1. WelcomeScreen

**Amaç:** Kullanıcıyı uygulamayla tanıştırmak, dil seçimini yaptırmak ve ana akışa giriş noktası sağlamak.

- Uygulama adı: **DeepSport Mobil Case**
- İçerik:
  - Uygulamanın ne yaptığına dair kısa açıklama (TR/EN):
    - Örnek: “Cihaz kamerası ile iskeletinizi takip eder, eliniz ekranın %75’ini geçtiğinde otomatik screenshot alır.”
  - Basit bir illüstrasyon veya logo alanı
- **Dil Seçimi (Global Language):**
  - Üst bar veya footer’da `TR | EN` toggle / segment control
  - Dil seçimi `LanguageContext` üzerinden global state’e yazılır
- Buton:
  - **“Başla / Get Started”** → `IntroCalibrationScreen` ekranına yönlendirir

**Davranış:**
- Uygulama açıldığında varsayılan dil (örneğin `tr`) seçili gelir.
- Kullanıcı dil değiştirdiğinde seçim tüm uygulamada geçerli olur ve diğer ekranlara aktarılan metinler anında güncellenir.

---

### 2.2. IntroCalibrationScreen

**Amaç:** Kullanıcıya gesture mantığını ve çekim davranışını açıklamak, aynı zamanda ön/arka kamera kullanımını kavramsal olarak tanıtmak.

- Layout (dikey mobil tasarım):
  - Başlık (TR/EN): Örneğin “El Hareketi ile Yakalama / Gesture-Based Capture”
  - Açıklama:
    - Elinizi ekranda sağ tarafa doğru hareket ettirdiğinizde, eliniz ekran genişliğinin **%75’ini geçtiğinde** screenshot alınacağı bilgisi
    - Ön veya arka kamerayı kullanabileceğinizi belirten kısa bilgi (asıl seçim MainScreen’de yapılır)
  - Statik veya hafif animasyonlu bir illüstrasyon:
    - Telefon ekranı + el hareketi
    - Threshold çizgisini gösteren basit bir görsel metafor
- Basit “sözde kalibrasyon” alanı (V1 için görsel açıklama):
  - Metin: “Ana ekranda, eliniz sağ tarafa ilerledikçe bir ilerleme hissi göreceksiniz ve %75’i geçtiğinde otomatik screenshot alınacak.”
  - Opsiyonel mini progress bar (dummy/örnek amaçlı, gerçek zamanlı değil)
- Butonlar:
  - **“Devam Et / Continue”** → `MainScreen`
  - (İsteğe bağlı) “Geri / Back” → `WelcomeScreen`

**Not:**
- V1’de gerçek zamanlı bir kalibrasyon akışı yok; sadece kullanıcıyı ana ekrandaki davranışa hazır hale getiren bir bilgilendirme ekranı gibi çalışır.
- Gerçek kalibrasyon / threshold ayarı ileride backlog kapsamında ele alınacaktır.

---

### 2.3. MainScreen

**Amaç:** Canlı kamera görüntüsü üzerinde pose/iskelet takibi yapmak, el hareketini izlemek ve %75 threshold’u geçince otomatik screenshot almak; hem ön hem arka kamera ile çalışmak.

**Yapı:**

#### Üst Bölüm (Header)

- Sol: Uygulama adı veya küçük logo (DeepSport Mobil Case)
- Orta: “Live / Canlı” badge
- Sağ:
  - Dil değiştirici (ikonlu küçük TR/EN toggle)
  - Kamera switch ikonu (ör: ön/arka kamera arasında geçiş butonu)

#### Orta Bölüm – Kamera + Pose Overlay

- **Kamera Önizleme:**
  - `expo-camera` ile canlı kamera feed’i
  - Başlangıçta **ön kamera (user)** ile açılır
  - Kamera modu state’i: `front` / `back`
  - Kamera switch butonuna basıldığında:
    - Ön kamera ↔ Arka kamera arasında geçiş yapılır
    - Overlay ve gesture hesaplamaları, seçili kamera üzerinden devam eder

- **Mirror / Pose Overlay:**
  - Ön kamera için:
    - Selfie hissi için video görüntüsü mirrored gösterilir
    - Pose landmark koordinatları da mirrored logiğe göre uyarlanır (el sağdaysa ekranda da sağda görünür)
  - Arka kamera için:
    - Mirroring tercihe göre:
      - Ya mirrored off (daha gerçekçi “gördüğünü göster” yaklaşımı)
      - Ya da unified deneyim için benzer koordinat mantığı korunur
  - MediaPipe Pose ile tespit edilen ana eklemler (omuz, dirsek, bilek vb.) overlay olarak çizilir

- **Threshold & Gesture:**
  - Ekranın sağ tarafında dikey bir threshold çizgisi (ekran genişliğinin %75 konumunda)
  - Elin x koordinasyonu takip edilir
  - El threshold çizgisini geçtiği anda:
    - Otomatik screenshot tetiklenir
    - “Auto Screenshot” özelliği her zaman aktif (ayrı bir toggle yok)

- **Progress Feedback:**
  - Ekranın bir köşesinde basit bir text veya mini progress bar:
    - Örnek: “El konumu: %X / Threshold: %75”
    - V1’de basit UI; animasyonlu görsel progress bar, ileriki versiyon için backlog’da tutulur

#### Alt Bölüm – Screenshot Galerisi

- Son çekilen screenshot’ların küçük thumbnail’ları yatay scroll ile gösterilir
- Her bir item:
  - Küçük resim
  - Üzerinde tıklanabilir alan → büyük önizleme veya cihaz galerisine kaydetme/ paylaşma
- Minimum V1 özellikleri:
  - Screenshot listeleme
  - Cihaza kaydetme / paylaşma için temel iş akışı

---

## 3. Teknoloji Stack

### 3.1. Core

- **React Native (Expo)**
  - Expo managed workflow
  - Expo Go üzerinden canlı test
- **TypeScript**
  - Güçlü tip desteği ve daha okunabilir kod

### 3.2. Kamera & İzinler

- **expo-camera**
  - Kamera izni isteme
  - Ön/arka kamera arasında geçiş (`type={CameraType.front/back}`)
  - Kamera preview alanının MainScreen’de yönetilmesi

- Timeout & Ref Kontrolleri:
  - Kamera başlatırken:
    - Kamera komponenti mount olduğunda `startCamera` fonksiyonu çağrılır
    - Ref kontrolleri ile unmount durumunda güvenli cleanup
    - 60s civarı bir timeout ile “kamera başlatılamadı” durumları düzgün yönetilir (örn. hata mesajı gösterilir)

### 3.3. Görüntü İşleme & ML

- **MediaPipe Pose**
  - Canlı kamera frame’lerinden pose tespiti
- **TensorFlow.js + tfjs-react-native**
  - Gerekli ek hesaplamalar için
- Performans:
  - Mobil cihaz kapasitesine göre frame rate optimizasyonu
  - Gerektiğinde kamera çözünürlüğünü düşürerek stabilite artırma

### 3.4. Navigasyon & Global State

- **React Navigation (Stack)**
  - Stack yapısı:
    - `WelcomeScreen`
    - `IntroCalibrationScreen`
    - `MainScreen`
- **Context & Hooks**
  - `LanguageContext`:
    - Global dil state: `'tr' | 'en'`
    - `LanguageProvider` → `App.tsx`’i sarar
    - `useLanguage` hook → ekranlardaki metinleri dinamikleştirmek için kullanılır
  - Kamera modu state’i (`front/back`) ve screenshot listesi, başlangıçta komponent state’inde; ileride store’a taşınabilir

---

## 4. Mimari & Klasör Yapısı

Önerilen klasör yapısı:

```txt
/src
  /screens
    WelcomeScreen.tsx
    IntroCalibrationScreen.tsx
    MainScreen.tsx

  /components
    common/
      AppButton.tsx
      AppText.tsx
      LanguageToggle.tsx
      Header.tsx
    camera/
      CameraPreview.tsx
      CameraSwitchButton.tsx
      PoseOverlay.tsx
      ThresholdIndicator.tsx
    gallery/
      ScreenshotItem.tsx
      ScreenshotList.tsx

  /services
    camera.service.ts     // expo-camera entegrasyonu, start/stop, type front/back, timeout
    pose.service.ts       // MediaPipe pose setup, frame processing
    gesture.service.ts    // el pozisyonu, threshold kontrolü
    screenshot.service.ts // frame capture, kaydetme / paylaşma

  /context
    LanguageContext.tsx

  /navigation
    RootNavigator.tsx

  App.tsx

