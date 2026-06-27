# Laravel 12+ & React TypeScript Fullstack Starter Kit

A visually stunning, premium fullstack template built with Laravel 12+, React 19, TypeScript, Tailwind CSS, and Shadcn UI. Includes a complete user control center, role-based access permissions, an instant header search bar (with MySQL SOUNDEX phonetic matching), real-time transaction notifications (with Echo & Reverb), and a secure local SSL HMR setup.

---

## 🚀 Getting Started

To keep the starter kit clean and avoid conflicts with the original repository history, use `degit` to create a fresh copy of this project:

### 1. Scaffold Your Project
Run this command in your terminal to clone a clean version of the files into a new folder (e.g. `my-awesome-app`):
```bash
npx degit Octopus1802/LaravelStarterKit. --force
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
*This concurrently starts the PHP local server, the Laravel queue listener, and the Vite client application using a single console.*

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

---

## ✨ Features Included

*   **Dashboard UI:** Frosted glass sidebar layouts (backdrop-blur), header toggles, and responsive navigation.
*   **Instant Search:** Header search bar using Laravel Scout Database engine enhanced with MySQL `SOUNDEX()` phonetic fallback for local typo tolerance and direct dashboard redirects.
*   **Real-Time Notifications:** Async database storage & Reverb WebSocket broadcasts that trigger Sonner toasts (emerald success, yellow pending, and red failed) and instant dropdown updates.
*   **User Control Center:** Visually rich datatables managing identities, security roles, system auditing logs, and super-admin login impersonation.
*   **Vite Local SSL:** Built-in `detectTls` setup matching local HTTPS (Herd/Valet) domains automatically.
