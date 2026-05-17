# Kawani HRIS - Frontend Dashboard

Proyek ini adalah antarmuka pengguna (Frontend/Dashboard) untuk aplikasi Human Resources Information System (HRIS) Kawani. Dibangun dengan framework modern, aplikasi ini menawarkan antarmuka yang cepat, responsif, dan kaya akan pengalaman pengguna (*User Experience*).

## Teknologi Utama
* **Framework**: Nuxt 3 (Vue 3)
* **Styling**: Tailwind CSS
* **State Management**: Pinia
* **Validasi & Form**: Vee-Validate & Zod
* **Ikonografi**: Lucide Vue
* **Komponen Interaktif**: `@vuepic/vue-datepicker` dan `@vueform/multiselect`

## Persyaratan Sistem (Requirements)
* Node.js >= 18.x
* NPM (atau Yarn/pnpm)

---

## Panduan Pengembangan Lokal (Local Development)

1. **Clone Repositori**
   ```bash
   git clone https://github.com/pldweb/kawani-frontend.git
   cd kawani-frontend
   ```

2. **Instalasi Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**
   Buat file `.env` di *root directory* proyek:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel `NUXT_PUBLIC_API_BASE_URL` mengarah ke *backend* API Laravel Anda.
   ```ini
   NUXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```

4. **Jalankan Server Lokal**
   ```bash
   npm run dev
   ```
   Aplikasi dashboard akan tersedia di `http://localhost:3000`. Segala perubahan pada kode (*hot module replacement*) akan langsung terlihat tanpa perlu me-*restart* server.

---

## Panduan Deployment (Production)

Nuxt 3 dapat di-*build* untuk berjalan di lingkungan Node.js (*Server Side Rendering*) secara penuh.

1. **Clone & Install Dependensi**
   ```bash
   git clone https://github.com/pldweb/kawani-frontend.git
   cd kawani-frontend
   npm install
   ```

2. **Konfigurasi Production Environment**
   Setel API *base URL* agar mengarah ke API Production di file `.env`:
   ```ini
   NUXT_PUBLIC_API_BASE_URL=https://api.domain-anda.com/api/v1
   ```

3. **Build Aplikasi**
   Perintah ini akan melakukan kompilasi dan mengoptimalkan kode ke dalam folder `.output/`.
   ```bash
   npm run build
   ```

4. **Menjalankan Server Production**
   Untuk uji coba, Anda dapat menjalankan hasil kompilasi langsung dengan Node:
   ```bash
   node .output/server/index.mjs
   ```

5. **Menjaga Server Tetap Hidup dengan PM2 (Direkomendasikan)**
   Di *production*, disarankan menggunakan *process manager* seperti **PM2**:
   ```bash
   npm install -g pm2
   pm2 start .output/server/index.mjs --name "kawani-hris-fe"
   pm2 save
   pm2 startup
   ```

6. **Konfigurasi Web Server (Reverse Proxy via Nginx)**
   Atur Nginx agar meneruskan (*reverse proxy*) permintaan web ke aplikasi Nuxt yang berjalan (biasanya di *port* 3000).
   ```nginx
   server {
       listen 80;
       server_name hris.domain-anda.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
