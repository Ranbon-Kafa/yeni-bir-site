# Video Galerisi ve Yükleme Sistemi

Bu proje, kullanıcıların kayıt olup giriş yapabileceği ve kendi cihazlarından sunucuya video yükleyip listeleyebileceği Node.js tabanlı bir web uygulamasıdır.

## 🚀 Kurulum ve Çalıştırma (Başka Bir Bilgisayarda)

Bu projeyi kendi bilgisayarınızda veya bir sunucuda çalıştırmak için aşağıdaki adımları izleyin:

### 1. Gereksinimler
Sisteminizde [Node.js](https://nodejs.org/) yüklü olmalıdır.

### 2. Projeyi İndirin
Terminali açın ve projeyi klonlayın (veya ZIP olarak indirip klasöre çıkartın):

```bash
git clone git clone https://github.com/Ranbon-Kafa/yeni-bir-site.git
cd video-galerisi
```

### 3. Gerekli Modülleri Kurun
Projenin çalışması için gereken paketleri indirmek üzere terminale şu komutu girin:
```bash
npm install
```
*(Bu komut `package.json` dosyasını okuyarak **express**, **multer** ve **express-session** modüllerini otomatik olarak kuracaktır.)*

### 4. Sunucuyu Başlatın
Modüller yüklendikten sonra sunucuyu başlatmak için:
```bash
node server.js
```

### 5. Tarayıcıda Açın
Sunucu sorunsuz başladığında terminalde bir onay mesajı göreceksiniz. Tarayıcınızı açın ve şu adrese gidin:
👉 **http://localhost:3000**

---

## 📦 Kullanılan Teknolojiler ve Modüller
*   **HTML, CSS, JavaScript** (Frontend)
*   **Node.js & Express.js** (Backend / Sunucu)
*   **Multer** (Dosya / Video yükleme işlemleri için)
*   **Express-Session** (Kullanıcı oturum yönetimi için)
*   **JSON** (Basit veritabanı yapısı olarak `users.json` ve `videos.json`)