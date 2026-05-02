const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = 3000;

const USERS_FILE = 'users.json';
const VIDEO_FILE = 'videos.json';

// 1. Gerekli Klasör ve Dosyaları Otomatik Oluştur
const dirs = ['./uploads/videos', './uploads/photos'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(VIDEO_FILE)) fs.writeFileSync(VIDEO_FILE, '[]');

// 2. Temel Ayarlar (public klasörünü dışa açıyoruz)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Oturum (Session) Ayarları
app.use(session({
  secret: 'cokGizliBirAnahtar123',
  resave: false,
  saveUninitialized: true
}));

// 4. Dosya Yükleme (Multer) Ayarları
const videoStorage = multer.diskStorage({
  destination: './uploads/videos',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const videoUpload = multer({ 
  storage: videoStorage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB sınır
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    // Desteklenen video formatları
    if (ext !== '.mp4' && ext !== '.mov' && ext !== '.webm' && ext !== '.avi' && ext !== '.mkv') {
      return cb(new Error('Sadece video dosyaları (.mp4, .mov, .webm, .avi, .mkv) kabul edilir.'));
    }
    cb(null, true);
  }
});

const photoStorage = multer.diskStorage({
  destination: './uploads/photos',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const photoUpload = multer({ storage: photoStorage });

// 5. Veritabanı (JSON) Yardımcı Fonksiyonları
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return []; 
  }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 6. --- API UÇLARI (ROUTES) ---

// Kayıt Ol
app.post('/register', photoUpload.single('photo'), (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(USERS_FILE);

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: 'Bu kullanıcı adı zaten alınmış!' });
  }

  const photoPath = req.file ? `/uploads/photos/${req.file.filename}` : null;
  users.push({ username, password, photo: photoPath });
  writeJSON(USERS_FILE, users);

  res.json({ success: true, message: 'Kayıt başarılı!' });
});

// Giriş Yap
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(USERS_FILE);

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre' });
  }

  req.session.username = username;
  res.json({ success: true, message: 'Giriş başarılı' });
});

// Çıkış Yap
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Oturum Kontrol Middleware
function requireLogin(req, res, next) {
  if (!req.session.username) {
    return res.status(403).send('Önce giriş yapmalısınız.');
  }
  next();
}

// Video Yükle (Hataları Ekran Basan Versiyon)
app.post('/upload', requireLogin, (req, res) => {
  videoUpload.single('video')(req, res, function (err) {
    if (err) {
      return res.status(400).send(`
        <div style="text-align:center; font-family:sans-serif; margin-top:50px;">
          <h2 style="color:#ff4b2b;">Yükleme Başarısız!</h2>
          <p><b>Hata:</b> ${err.message}</p>
          <a href="/upload.html" style="text-decoration:none; color:blue;">⬅ Geri Dön ve Tekrar Dene</a>
        </div>
      `);
    }

    if (!req.file) {
      return res.status(400).send('Lütfen bir dosya seçin.');
    }

    const videos = readJSON(VIDEO_FILE);
    const videoData = {
      uploader: req.session.username,
      filename: req.file.filename,
      path: `/uploads/videos/${req.file.filename}`,
      uploadedAt: new Date()
    };
    
    videos.push(videoData);
    writeJSON(VIDEO_FILE, videos);
    
    res.redirect('/index.html');
  });
});

// Videoları Listele
app.get('/videos', (req, res) => {
  res.json(readJSON(VIDEO_FILE));
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Sunucu başarıyla başlatıldı! http://localhost:${PORT} adresine gidebilirsiniz.`);
});