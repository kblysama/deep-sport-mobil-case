# DeepSport Mobil Case – Mobile UI Design Spec (Adapted from Web App)

Bu doküman, DeepSport web uygulamasındaki mevcut ekranların (Welcome, IntroCalibration, Main) mobil versiyon için nasıl uyarlanacağını anlatır.  
Amaç: Web tasarımının görsel kimliğini ve bilgi mimarisini korurken, **React Native + Expo** ile rahat kullanılabilen, dikey mobil layout’lar üretmek.

---

## 0. Genel Tasarım Prensipleri

- **Uygulama adı:** `DeepSport Mobil Case`
- **Tema:** Koyu tema, web ile aynı renk paleti:
  - Arka plan ana: `#0f172a`
  - Kart arka plan: `#111827`
  - Sekme / blok arka plan: `#1e293b`
  - Vurgu mavisi (primary): `#2563EB` / `#3B82F6` (Tailwind `blue-600 / blue-500`)
  - Yazı:
    - Başlık: beyaz
    - Gövde metin: `#9CA3AF` / `#6B7280`
- **Tipografi:**
  - Başlıklar: Semi-bold/Bold, mobilde 24–32 px
  - Paragraf: 14–16 px
  - Etiketler / yardımcı metin: 12–13 px
- **Layout:**
  - Her ekran: `Safe Area` içinde, dikey scroll destekli.
  - İçerik genişliği: kenarlardan ~16–20 px padding.
  - Kartlar: yuvarlatma `16–24 px`, hafif shadow.
- **Dil desteği:**
  - Global `LanguageContext (tr/en)` korunur.
  - Dil switcher tüm ekranlardan erişilebilir (özellikle Welcome + Main header).
- **Kamera:**
  - `expo-camera` kullanılacak.
  - **Hem ön (front) hem arka (back) kamera** desteklenecek.
  - Kamera geçişi MainScreen header’da kamera toggle ikonu ile yapılır.

---

## 1. WelcomeScreen (Mobile Adaptation)

### 1.1. Amaç

- Kullanıcıyı DeepSport Mobil Case ile tanıştırmak.
- Uygulamanın ne yaptığını basit dille anlatmak.
- Dil seçimi ve “akışa giriş” butonunu sunmak.

### 1.2. Genel Yerleşim

**Yapı:**

1. **Header (üst bar)**  
   - Sol: Logo + uygulama adı  
     - Logo: 40–48 px yüksekliğinde, köşeleri hafif yuvarlatılmış.  
     - Metin: “DeepSport Mobil Case” (veya kısa: “DeepSport Case”).  
   - Sağ: Dil switcher  
     - Küçük “TR / EN” pill component:
       - Aktif dil: mavi arka plan, beyaz metin.
       - Pasif dil: koyu gri arka plan, gri metin.

2. **Hero Bölümü (ortada, scroll’un üst kısmı)**  
   - Başlık (heroTitle):
     - TR: “Hoş Geldiniz”
     - EN: “Welcome”
     - Mobil boyut: 28–32 px bold, tek satır veya iki satır.
   - Alt metin (heroSubtitle):
     - TR & EN text web’deki ile aynı içerik; sadece max 2–3 satır olacak şekilde kırılır.
   - Arka planda minimal bir gradient/blur blob veya küçük ilustrasyon (el + kamera metaforu) olabilir.

3. **Özellik Kartları (features)**  
   Web’deki 3 kolon grid, mobilde **dikey kart listesi** olur:
   - Her kart tam genişlikte, arasında 12–16 px boşluk.
   - İçerik:
     - Üstte ikon (Hand, Cpu, Shield stilini mobil stroke/size’a uyarlanmış).
     - Altında başlık (feature1Title, feature2Title, feature3Title).
     - Altında kısa açıklama (feature1Desc, …).
   - Kart arka plan: `#1e293b`
   - Border: `#374151` (hover yok, ama pressed state için küçük scale + shadow kullanılabilir).

4. **Call To Action (CTA)**  
   - Ekranın altına yakın, ortalanmış büyük buton:
     - Label: TR: “Hadi Başlayalım!”, EN: “Let’s Get Started!”
     - Genişlik: %80 civarı, radius 999 (pill).
     - Tıklayınca → `IntroCalibrationScreen`.

5. **Footer (opsiyonel, daha sade)**  
   - “Gizlilik Politikası / Privacy Policy”, “Hizmet Şartları / Terms of Service” linkleri tek satırda veya alt alta küçük, gri metinle verilebilir.
   - Çok yer kaplamaması için mobile’da font boyutu 11–12 px.

### 1.3. Mobilde Web’den Farklı Olan Noktalar

- Web’deki geniş hero fontları ve büyük boşluklar mobilde sıkıştırılır, ama hiyerarşi korunur.
- Özellik kartları 3 sütun yerine dikey tek sütun haline gelir.
- Footer daha minimal tutulur; asıl odak CTA butonu ve feature’lar olur.

---

## 2. IntroCalibrationScreen (Mobile Adaptation)

### 2.1. Amaç

- Kullanıcıya **el hareketi ile screenshot alma** mantığını öğretmek.
- Threshold mantığını (örn. %75) açıklamak.
- Kamera davranışı ve beklenen hareket hakkında görsel bir rehber sunmak.

### 2.2. Genel Yerleşim

1. **Header**  
   - Welcome ile benzer:
     - Sol: Logo + “DeepSport Mobil Case” text.
     - Sağ: Dil switcher (TR/EN pill).
   - Yükseklik: ±56–64 px.

2. **Başlık & Açıklama (Text Block)**  
   - Ortalanmış veya sola dayalı:
     - Başlık: TR: “Ekran Görüntüsü İçin El Hareketi”, EN: “Hand Gesture for Screenshot”
     - Alt açıklama:
       - Elinizi ekranın %75’ine kadar götürünce ne olacağını basitçe anlatan 1–2 cümle.
   - Bu blok maksimum 3–4 satır olacak şekilde kısaltılmalı.

3. **How It Works Bölümü (Steps)**  
   - Kart benzeri bir blok, arka plan `#111827`.
   - İçinde:
     - Küçük başlık: “Nasıl Çalışır?” / “How It Works?”
     - 3 adımlı liste:
       1. Kameraya izin ver / Allow camera access
       2. Elini kameranın görebileceği alana getir
       3. Elini bir uçtan diğer uca doğru kaydır
   - Her adım:
     - Solda numaralı küçük daire (1,2,3).
     - Sağda açıklama metni (TR/EN).

4. **Görsel Rehber (Calibration Illustration)**  
   - How It Works kartının altında veya içinde:
     - 16:9 oranında bir görsel/placeholder:
       - Arka plan: açık turuncu/bronz ton (web’deki “calibration-guide” görselini temsil eden alan).
       - İçerikte: telefon ekranı + el + sağda bir çizgi ile threshold metaforu.
   - Bu görsel statik; gerçek kameraya bağlanmaz.

5. **Basitleştirilmiş Kalibrasyon Bilgisi (V1)**  
   - Web’deki canlı kamera + slider + progress bar seti **mobile V1’de sadeleştirilmiş** olabilir:
     - Metin: 
       - “Eliniz ekranın %75’ini geçtiğinde ekran görüntüsü alınır.”
     - Opsiyonel mini statik progress bar:
       - Boş bar + threshold konumunu gösteren ince çizgi.
       - Sadece mantığı anlatır, gerçek zamanlı değildir.

   > Eğer canlı kalibrasyon istersen:
   > - Küçük bir “mini kamera preview” alanı eklenip, progress bar ile el konumu gösterilebilir.
   > - Ancak asıl full-screen kamera **MainScreen**’de olacak.

6. **Primary Action Butonu**  
   - Ekranın alt kısmında:
     - Label: “Devam Et / Continue”
     - Full-width, yuvarlatılmış.
     - Tıklanınca → `MainScreen`.

### 2.3. Mobilde Web’den Farklı Olan Noktalar

- Web’deki çift kolon layout (sol bilgi, sağ canlı kamera) tek kolon dikey düzene çevrilir.
- Threshold slider ve canlı progress bar:
  - Mobile V1’de opsiyonel; ürün stratejine göre ya kaldırılır ya da minimal bir versiyon eklenir.
- Kamera izni için ayrı **CameraAllowScreen** yok; mobilde izin OS dialog’u ile yönetilir, IntroCalibration sadece konsepti anlatır.

---

## 3. MainScreen (Mobile Adaptation)

### 3.1. Amaç

- Canlı kamera görüntüsü üzerine **pose/iskelet overlay** çizmek.
- El hareketini takip ederek **otomatik screenshot** almak (el ekranın %75’ini geçtiğinde).
- Hem **ön** hem **arka** kamera ile çalışmak.
- Basit bir galeri ile alınan screenshot’ları göstermek.

### 3.2. Genel Yerleşim

1. **Header (Top App Bar)**

- Arka plan: `#0f172a` + hafif shadow.
- Yükseklik: 56–64 px.
- İçerik:
  - Sol: Logo (32–40 px) + “DeepSport Mobil Case” text.
  - Orta: Küçük “Live / Canlı” badge (yeşil nokta + text).
  - Sağ:
    - Dil switcher (TR / EN) – istersen burayı sadece icon’a indirip tam dil seçimini ayrı ekrana da alabilirsin.
    - **Kamera switch ikonu**:
      - İkon: ön/arka kamera metaforu.
      - State: “Front”/“Back” görsel farkı ya da küçük metin.

> Davranış: Kamera switch’e basınca `front <-> back` toggle yapılır, overlay ve gesture logic aynı kalır.

---

2. **Kamera + Iskelet Alanı (Ana Bölüm)**

- Ekranın üst yarısından fazlasını kaplar (yaklaşık ekran yüksekliğinin %55–65’i).
- İçerik:
  - `expo-camera` preview (aspect ratio 16:9 veya cihaz oranına göre).
  - Üzerine çizilen:
    - Mirrored video (özellikle ön kamera için selfie hissi).
    - MediaPipe Pose skeleton çizimleri.
    - Threshold çizgisi:
      - Ekranın sağ tarafında dikey çizgi (x = %75).
      - Renk: opak mavi, hafif dashed line efekti.
- Overlay katmanı:
  - Üstte küçük status text:
    - Örn: “Elinizi kameraya gösterin” / “Show your hand to the camera”.
  - Hata durumunda:
    - Tam ekran yarı opak katman + hata ikonu + mesaj (“Kamera Hatası”, “Camera Error” vb.).

---

3. **Progress & Status Bölümü**

Kamera alanının hemen altında, kart şeklinde:

- Kart arka plan: `#111827`, radius `20 px`, padding `16 px`.
- İçerik:
  1. **El Pozisyonu / Hand Position**
     - Solda label: “El Pozisyonu”.
     - Sağda numeric yüzde: `Math.round(progress)%` (0–100).
  2. **Progress Bar**
     - Arka bar: `#374151`, radius `999`.
     - İç bar: mavi, genişliği `progress%`.
     - Threshold marker:
       - İnce sarı çizgi, `%75` konumunda (veya state’te ne ise).
  3. **Açıklama Metni**
     - Eğer `progress >= threshold`:
       - TR: “✅ Eşik aşıldı! Ekran görüntüsü alınabilir.”  
       - EN: “✅ Threshold exceeded! Screenshot can be taken.”
     - Eğer `progress > 0` ama `< threshold`:
       - “Eşiğe ulaşmak için %75 gerekiyor.” / “Need %75 to reach threshold.”
     - Eğer `progress == 0`:
       - “Elinizi kameraya gösterin.” / “Show your hand to the camera.”

> Not: Web’deki `delay`, `autoScreenshot`, `skeletonView` gibi advanced ayarlar mobile V1’de **arka plana alınmış** veya hiç gösterilmeyebilir; mantık aynen çalışır ama UI sade tutulur.

---

4. **Screenshot Galerisi (Alt Bölüm)**

- Header satırı:
  - Sol: “Ekran Görüntüleri (N)” / “Screenshots (N)”
  - Sağ: Küçük ikon buton grubu (opsiyonel):
    - Tümünü indir (download all) – mobilde daha çok “paylaş” / “save all” akışına dönüştürülebilir.
    - Tümünü sil – küçük çöp kutusu icon butonu.
- Grid / List:
  - Mobile için önerilen:
    - 2 kolon grid (small cards) veya yatay scroll list.
  - Her item:
    - 16:9 thumbnail.
    - Üstte hafif gradient overlay + timestamp (küçük text).
    - Üste binen 2 küçük buton:
      - Sol: İndir / Paylaş (download/share).
      - Sağ: Sil (delete).
- Scroll:
  - Galeri alanı dikey scroll’lu olabilir; ekranın altına kadar uzanır.

---

### 3.3. Gesture & Screenshot Davranışı

- **El Takibi:**
  - Pose landmarks içinden bilek/eldeki noktalara bakılır.
  - X konumu normalize edilir (`0–1`); ekrana göre pozisyona çevrilir.
  - Progress = `x * 100` (veya gestureService mantığına göre).
- **Threshold:**
  - Sabit değer: `%75`.
  - El `%75`’i geçtiğinde:
    - Auto screenshot tetiklenir.
    - Canvas üzerinden görüntü + overlay yakalanır.
    - Screenshot galerisine eklenir.
- **Cooldown:**
  - Arka planda gesture cooldown (örneğin 2 sn) çalışır; UI’da extra slider gösterilmez.
- **İkonik Feedback:**
  - Screenshot alındığında:
    - Küçük toast: “Ekran görüntüsü alındı!” / “Screenshot taken!”
    - Mobilde ekranın alt tarafında beliren, 2–3 saniye sonra kaybolan bir banner.

---

## 4. Navigasyon Akışı (Özet)

1. **WelcomeScreen**
   - Kullanıcı uygulamayı açar.
   - Dil seçer (TR/EN).
   - “Hadi Başlayalım!” butonuna basar → `IntroCalibrationScreen`.

2. **IntroCalibrationScreen**
   - Kullanıcıya gesture ve threshold mantığı anlatılır.
   - İsterse sadece text + illustration ile bilgi alır.
   - “Devam Et / Continue” butonu → `MainScreen`.

3. **MainScreen**
   - Kamera otomatik açılır (ön kamera default).
   - Kullanıcı isterse header’daki kamera switch butonu ile arkaya geçer.
   - El hareketi ile screenshot alınır.
   - Galeri alt bölümde gösterilir.

---

## 5. Antigravity İçin Not

- Lütfen tasarımları **tamamen mobil ekran** düşünerek, dikey akış ve başparmak erişilebilirliği ön planda kalacak şekilde üret.
- Web tasarımdaki:
  - Renk paleti,
  - Metin içerikleri (TR/EN),
  - İkon konsepti (el, CPU, kalkan, kamera, activity),
  - “Koyu arka plan + kartlar” estetiği
  birebir korunmalı.
- MainScreen’de:
  - Ekranın en büyük alanını **kamera + iskelet overlay** kaplamalı.
  - Progress, status ve galeri, kamera alanının altında, kartlar halinde yer almalı.
- Tasarımlar React Native + Expo için kullanılacak; bu yüzden:
  - Component’lerde aşırı ince detaylardan kaçınılabilir,
  - Genel layout, padding ve hiyerarşi geliştirici için açık ve tekrar kullanılabilir olmalı.
