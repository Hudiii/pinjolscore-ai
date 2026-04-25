<div align="center">

# 🏦 PinjolScore-AI

### Sistem Analitik Kredit Berbasis AI untuk Pinjaman Online

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

</div>

---

## 📖 Deskripsi

**PinjolScore-AI** adalah platform analitik kredit internal yang dirancang untuk membantu lembaga pinjaman online (pinjol) dalam mengevaluasi kelayakan kredit nasabah secara otomatis dan akurat menggunakan pendekatan berbasis data dan kecerdasan buatan.

Dashboard ini menyediakan:
- 📊 **Visualisasi DTI (Debt-to-Income) Trend** secara real-time
- 🤖 **Analisis kredit otomatis** dengan scoring model AI
- 👥 **Manajemen data nasabah** terpusat
- 🔐 **Autentikasi & otorisasi** berbasis role
- 📋 **Laporan evaluasi kredit** yang komprehensif

---

## 🏗️ Arsitektur Sistem

```
Projek_pinjol/
├── api/          # Backend — Laravel 11 (REST API)
│   ├── app/
│   │   ├── Http/Controllers/
│   │   └── Models/
│   ├── database/
│   ├── routes/
│   └── ...
└── client/       # Frontend — Next.js 15 + TypeScript
    ├── src/
    │   └── app/
    │       ├── page.tsx          # Dashboard utama
    │       ├── login/            # Halaman autentikasi
    │       ├── evaluations/      # Evaluasi kredit
    │       ├── customers/        # Data nasabah
    │       └── settings/         # Pengaturan
    └── ...
```

---

## 🚀 Cara Menjalankan (Development)

### Prasyarat

| Tool | Versi Minimum |
|------|--------------|
| PHP | 8.2+ |
| Composer | 2.x |
| Node.js | 18+ |
| npm | 9+ |

---

### 1. Clone Repository

```bash
git clone https://github.com/Hudiii/pinjolscore-ai.git
cd pinjolscore-ai
```

---

### 2. Setup Backend (Laravel API)

```bash
cd api

# Install dependencies
composer install

# Salin file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Jalankan migrasi database
php artisan migrate --seed

# Jalankan server
php artisan serve
```

> Backend berjalan di: **http://localhost:8000**

---

### 3. Setup Frontend (Next.js Client)

Buka terminal baru:

```bash
cd client

# Install dependencies
npm install

# Salin file environment
cp .env.example .env.local
# Sesuaikan NEXT_PUBLIC_API_URL=http://localhost:8000

# Jalankan server
npm run dev
```

> Frontend berjalan di: **http://localhost:3000**

---

## 🔑 Environment Variables

### `api/.env` (Backend)
```env
APP_NAME=PinjolScore-AI
APP_ENV=local
APP_URL=http://localhost:8000
DB_CONNECTION=sqlite
# Sesuaikan konfigurasi lainnya
```

### `client/.env.local` (Frontend)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Recharts |
| Backend | Laravel 11, PHP 8.2 |
| Database | SQLite (dev) / MySQL (prod) |
| Auth | Laravel Sanctum |
| API | REST API (JSON) |

---

## 📁 Struktur API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/login` | Autentikasi pengguna |
| GET | `/api/customers` | Daftar nasabah |
| POST | `/api/customers` | Tambah nasabah |
| GET | `/api/evaluations` | Daftar evaluasi kredit |
| POST | `/api/evaluations` | Buat evaluasi baru |
| GET | `/api/loan-analyses` | Riwayat analisis pinjaman |

---

## 🤝 Kontribusi

Pull request sangat disambut! Untuk perubahan besar, buka issue terlebih dahulu untuk mendiskusikan apa yang ingin diubah.

1. Fork repository ini
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`
4. Push ke branch: `git push origin feat/nama-fitur`
5. Buka Pull Request

---

## 📝 Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](./LICENSE) untuk detail.

---

<div align="center">
Made with ❤️ by <strong>Hudiii</strong>
</div>
