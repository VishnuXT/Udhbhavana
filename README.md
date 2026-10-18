# Udhbhavana 2027 — Responsive Event Website & Firebase Admin CMS

A production-ready, minimal, modern event website and secure Content Management System (CMS) for **Udhbhavana 2027**, presented by **Sree Buddha College of Engineering (Autonomous)** in association with **Operation Toofan**.

- **Slogan**: Aim IT.. Win IT
- **Awareness Campaign**: No to drugs, Yes to life
- **Prize Pool**: Prizes over ₹1 Lakh
- **Location**: Pattoor P.O., Nooranad, Alappuzha District, Kerala – 690507

---

## 🛠️ Technology Stack

- **Frontend**: React 18 / 19 with Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS (Variables, modular CSS architecture, no bulky CSS frameworks)
- **Icons**: Lucide React
- **Backend & Database**: Firebase Authentication, Cloud Firestore, Firebase Storage
- **Offline / Local Fallback**: Built-in reactive fallback with automatic session persistence

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 2. Local Setup
```bash
# Clone or navigate to the repository directory
cd udhbavana

# Install dependencies
npm install

# Start the local development server
npm run dev
```

The application will be live at `http://localhost:5173`.

---

## 🔐 Administrator CMS & Access

The protected admin portal is located at `/admin`.

### Local Development / Offline Preview Credentials
When Firebase environment variables are not yet configured in `.env`, the system runs in high-fidelity interactive local mode:
- **Admin Login URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@udhbhavana.edu` (or click "Fill Demo Credentials")
- **Password**: `Admin@2027`

All content edits, competition additions/reordering, and publishing switches will save immediately and update the public landing page in real time.

---

## 🔥 Firebase Setup Guide (Production)

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `udhbhavana-2027`.
3. Disable Google Analytics (optional) and create the project.

### Step 2: Register a Web Application
1. In the project dashboard, click the **Web icon (`</>`)** to add an app.
2. App nickname: `Udhbhavana Web`.
3. Register the app and copy your Firebase SDK config keys.

### Step 3: Configure Environment Variables
Create a file named `.env` in the root of the project:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=udhbhavana-2027.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=udhbhavana-2027
VITE_FIREBASE_STORAGE_BUCKET=udhbhavana-2027.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Step 4: Enable Firebase Authentication
1. In the Firebase Console, go to **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable **Email/Password**.
4. Switch to the **Users** tab and click **Add user**:
   - **Email**: `admin@sbce.ac.in` (or your official college admin email)
   - **Password**: Choose a strong password.

### Step 5: Enable Cloud Firestore
1. In the Firebase Console, navigate to **Build > Firestore Database**.
2. Click **Create Database**.
3. Select your preferred server location (e.g., `asia-south1` for Mumbai/India).
4. Start in **Production mode**.
5. Copy the contents of [`firestore.rules`](./firestore.rules) into the **Rules** tab and click **Publish**.

### Step 6: Enable Firebase Storage
1. Navigate to **Build > Storage**.
2. Click **Get Started** and select your storage bucket region.
3. Copy the contents of [`storage.rules`](./storage.rules) into the **Rules** tab and click **Publish**.

---

## 📁 Project Architecture

```
udhbavana/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── logo.png          # Official Udhbhavana 2027 Logo
│   │   └── poster.jpg        # Official High-Res Event Poster
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky responsive navbar with drawer & CTAs
│   │   ├── HeroSection.jsx   # Hero with logo, tagline, slogans & poster preview
│   │   ├── PosterModal.jsx   # Fullscreen poster view modal
│   │   ├── AboutSection.jsx  # College & Operation Toofan details
│   │   ├── CompetitionSection.jsx # Grid of 5 signature competition tracks
│   │   ├── CompetitionCard.jsx    # Card with rules and interactive details modal
│   │   ├── PrizeSection.jsx       # Prizes over ₹1 Lakh showcase
│   │   ├── InaugurationSection.jsx # Chief Guest details and status note
│   │   ├── EventInfoSection.jsx   # Date, venue, address, and Google Maps CTA
│   │   ├── AnnouncementSection.jsx# Live alerts & active announcements
│   │   ├── ContactSection.jsx     # Verified contact desk & college address
│   │   ├── Footer.jsx             # Comprehensive footer with admin link
│   │   └── ProtectedRoute.jsx     # Auth guard protecting admin routes
│   ├── pages/
│   │   ├── Home.jsx               # Single landing page with maintenance support
│   │   ├── AdminLogin.jsx         # Secure authentication page
│   │   └── AdminDashboard.jsx     # Master admin dashboard
│   ├── admin/
│   │   ├── AdminLayout.jsx        # Responsive sidebar, drawer & header
│   │   ├── OverviewPanel.jsx      # Summary metrics and quick actions
│   │   ├── WebsiteContentEditor.jsx # Edit all global text, dates & section toggles
│   │   ├── CompetitionManager.jsx # CRUD & reordering for competitions
│   │   ├── AnnouncementManager.jsx# CRUD with auto-expiry for notices
│   │   ├── MediaManager.jsx       # Upload and replace logo/posters
│   │   └── SettingsPanel.jsx      # Live publishing vs maintenance toggle
│   ├── services/
│   │   ├── firebase.js            # Firebase SDK initialization with fallback
│   │   ├── initialData.js         # Initial poster details & 5 competitions
│   │   ├── authService.js         # Authentication layer
│   │   ├── siteConfigService.js   # Site configuration Firestore service
│   │   ├── competitionService.js  # Competition tracks Firestore service
│   │   ├── announcementService.js # Announcements Firestore service
│   │   └── storageService.js      # Image validation and storage service
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useSiteConfig.js
│   │   ├── useCompetitions.js
│   │   └── useAnnouncements.js
│   ├── styles/
│   │   ├── variables.css          # Design tokens & color system
│   │   ├── global.css             # Base styles, buttons, badges, modals
│   │   ├── navbar.css             # Navigation & mobile drawer
│   │   ├── home.css               # Public section layouts
│   │   └── admin.css              # CMS layout, form controls & tables
│   ├── App.jsx                    # Routing configuration
│   └── main.jsx                   # React root entry point
├── firestore.rules                # Production security rules for Firestore
├── storage.rules                  # Production security rules for Storage
├── .env.example                   # Environment configuration template
└── README.md                      # Complete project documentation
```

---

## 🏗️ Building for Production

To create an optimized production build:
```bash
npm run build
```
The output files will be created in the `dist/` directory ready for deployment to any static hosting service (Firebase Hosting, Vercel, Netlify, or AWS S3/CloudFront).

---

## ✅ Acceptance & Quality Checklist

- [x] **No Tailwind CSS**: Built with clean, custom Vanilla CSS.
- [x] **Original Assets Used**: Official event logo and poster preserved directly.
- [x] **All 5 Competitions Included**: Painting Competition, Working Model Presentation, Reel Making, Ideathon, Quiz Competition.
- [x] **No Invented Details**: Unconfirmed items marked accordingly; no fake phones or placeholder counts.
- [x] **Live Admin CMS**: Full editing of titles, dates, venues, competitions, announcements, and asset uploads.
- [x] **Security Rules**: Production rules implemented in `firestore.rules` and `storage.rules`.
- [x] **Responsive Across All Screens**: Verified on mobile (320px–480px), tablet (768px), and desktop (1024px–1920px).
