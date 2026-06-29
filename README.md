# Laravel 12+ & React TypeScript Fullstack Starter Kit

A visually stunning, premium fullstack template built with Laravel 12+, React 19, TypeScript, Tailwind CSS, and Shadcn UI. Includes a complete user control center, role-based access permissions, an instant header search bar (with MySQL SOUNDEX phonetic matching), real-time transaction notifications (with Echo & Reverb), and a secure local SSL HMR setup.

---

## 🚀 Getting Started

To keep the starter kit clean and avoid conflicts with the original repository history, use `degit` to create a fresh copy of this project:

### 1. Scaffold Your Project
Run this command in your terminal to clone a clean version of the files into a new folder (e.g. `my-awesome-app`):
```bash
npx degit Octopus1802/LaravelStarterKit . --force
```

### 2. Install Dependencies & Setup
Since individual package folders and environments are excluded by `.gitignore`, you must install dependencies and configure the environment. We provide a single convenience command to configure everything:
```bash

composer run setup
```
*This command runs `composer install`, sets up your `.env` file, generates application keys, runs database migrations, runs `npm install`, and compiles assets.*

---

## 📁 Directory Structure

```text
my-awesome-app/
├── app/                  # Backend Application Logic
│   ├── Http/
│   │   └── Controllers/  # SearchController, UserController, ChatController
│   ├── Models/           # User.php (configured with Scout Searchable)
│   └── Traits/           # HasTransactionNotifications.php
│
├── config/               # App Configuration
│   ├── scout.php         # Scout Search columns config
│   └── reverb.php        # Reverb WebSockets config
│
├── resources/            # Frontend Assets & React Application
│   ├── css/
│   │   └── app.css       # Tailwind CSS styles
│   └── js/
│       ├── components/   # HeaderSearch, NotificationDropdown, AppSidebar
│       ├── layouts/      # AppSidebarLayout, AppHeaderLayout
│       └── pages/        # User Control Center, ChatRoom, Settings
│
├── routes/               # Routing
│   └── web.php           # API and Inertia controller paths
│
├── composer.json         # PHP workspace configurations & installer scripts
└── package.json          # Root frontend workspace configurations
```

---

## 💻 Running Locally

You can launch both frontend and backend concurrently or independently.

### Option A: Concurrent Fullstack Startup (Recommended)
From the root folder, run:
```bash
npm run dev
```
*This concurrently starts the PHP local server, the Laravel queue listener, the Reverb WebSocket server, and the Vite client application using a single console.*

### Option B: Independent Startup

**Start the Web Server & WebSockets**
```bash
php artisan serve
php artisan reverb:start
php artisan queue:listen
```

**Start the Vite Frontend Client**
```bash
npm run dev
```

### 🔒 Local SSL & WebSockets (Herd / Valet Setup)
When running your local site over HTTPS (e.g. using Laravel Herd or Valet), browsers block insecure WebSocket connections (`ws://`). To route secure WebSockets (`wss://`) through port `443` without certificate errors:

1. **Configure Herd Nginx Proxy**:
   Add this location block to your site's Nginx configuration (located at `~/.config/herd/config/valet/Nginx/laravelstarterkit.test.conf` on Windows or `~/.config/valet/Nginx/your-site.conf` on macOS):
   ```nginx
   location /app {
       proxy_pass http://127.0.0.1:8080;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection "Upgrade";
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }
   ```
   *After editing, restart Herd/Valet using `herd restart` (or `valet restart`).*

2. **Configure Environment (`.env`)**:
   Ensure you decouple backend local communication from the secure frontend connection:
   ```env
   # Backend connects locally via HTTP
   REVERB_HOST="127.0.0.1"
   REVERB_PORT=8080
   REVERB_SCHEME=http

   # Frontend connects securely via Nginx proxy on port 443
   VITE_REVERB_HOST="laravelstarterkit.test"
   VITE_REVERB_PORT=443
   VITE_REVERB_SCHEME=https
   ```

---

## ✨ Features Included

*   **Dashboard UI:** Frosted glass sidebar layouts (backdrop-blur), header toggles, and responsive navigation.
*   **Instant Search:** Header search bar using Laravel Scout Database engine enhanced with MySQL `SOUNDEX()` phonetic fallback for local typo tolerance and direct dashboard redirects.
*   **Real-Time Notifications:** Async database storage & Reverb WebSocket broadcasts that trigger Sonner toasts (emerald success, yellow pending, and red failed) and instant dropdown updates.
*   **User Control Center:** Visually rich datatables managing identities, security roles, system auditing logs, and super-admin login impersonation.
*   **Vite Local SSL:** Built-in `detectTls` setup matching local HTTPS (Herd/Valet) domains automatically.
