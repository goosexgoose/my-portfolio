
# Personal Portfolio Platform

A full-featured, self-hosted portfolio platform built with **Next.js**, **Firebase**, **TipTap**, and **Tailwind CSS**. This project is more than a personal website — it’s a content management platform that allows full control over the display, editing, and publishing of diverse project types, including code, game localization, and photography.

## ✨ Features

### 🌐 Public-Facing Pages
- `/projects`: Displays all published projects, grouped by category, with filters, hover animations, and skill tags.
- `/projects/[id]`: Detail pages rendered from TipTap JSON content, supporting images, YouTube videos, and multilingual layout.
- `/cv`: Timeline-based resume with animation, downloadable PDF resume (multi-language), and a project carousel.
- `/gallery`: Login-gated gallery with hover effects and image viewer/lightbox.
- `/contact`: Contact form connected to Firestore and/or EmailJS (optional notifications).

### 🔐 Admin Dashboard (`/admin`)
- **Authentication**: Firebase Auth with Google login support.
- **Project Manager**: 
  - Rich text editor (TipTap) with auto-save
  - Upload images, YouTube videos, PDFs
  - Skill tagging, cover images, draft/publish toggle
  - Timestamps (`createdAt`, `updatedAt`)
- **Gallery Manager**: Manage and upload private photos.
- **CV Manager**: Edit CV timeline and upload resumes (multi-language).
- **Contact Manager**: View form submissions; optionally send notifications.

### 🧠 Additional Highlights
- Custom-built TipTap editor with real-time preview and version-safe content saving.
- Skills visualization using D3-force with draggable, animated SVG bubbles.
- Fully responsive and mobile-friendly layout.
- SEO-optimized dynamic metadata (with server-side `generateMetadata`).
- Fine UX details: ESC-close modals, saving indicators, blurred gallery preview when not logged in.

## 🧱 Tech Stack

| Layer       | Tech                                                |
|-------------|-----------------------------------------------------|
| Frontend    | Next.js (App Router), TypeScript, Tailwind CSS      |
| UI          | ShadCN UI, GSAP, Swiper, D3-Force                   |
| Editor      | TipTap (rich text editor, custom extensions)        |
| Auth & Data | Firebase Auth, Firestore, Firebase Storage          |
| Media       | Cloudinary (image/PDF uploads, YouTube embed)       |
| Email       | EmailJS (optional contact notification system)      |
| Hosting     | Vercel (frontend), Firebase/Cloudinary (assets)     |

## 🚧 Development Notes

### Project Structure
```
app/
  projects/
    [id]/page.tsx         # Project detail renderer
    page.tsx              # Public projects list
  admin/
    ProjectManager.tsx    # Main editing interface
  cv/
    page.tsx              # CV page with timeline and carousel
  gallery/
    page.tsx              # Auth-gated gallery
lib/
  firebaseConfig.ts       # Firebase setup
  uploadToCloudinary.ts   # Media upload logic
components/
  RichTextEditor.tsx      # TipTap editor
  RichContentViewer.tsx   # TipTap JSON renderer
  ResumeDownloadButton.tsx
  SkillForceLayout.tsx    # D3-based skill bubble graph
```

### Auto Save
Projects are auto-saved during editing via debounced Firestore writes. Status indicators are shown for feedback. Drafts are isolated until explicitly published.

### Authentication
Admin dashboard is protected via Firebase Auth. Logged-in users also get access to the gallery page.

## 🧪 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-portfolio.git
cd your-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase & Cloudinary
Create a `.env.local` file and add the following:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

Make sure to initialize your Firebase project and set up Firestore rules for read/write security.

### 4. Run Locally
```bash
npm run dev
```

## 📦 Deployment

This project is designed to be deployed to **Vercel**. Ensure your Firebase and Cloudinary credentials are added to your Vercel environment variables.

## 🙋‍♂️ Author

This platform is designed, developed, and maintained by [Your Name].  
I built it to showcase my skills and manage my content like a real-world product — not just a static site.

If you're curious about the architecture or want to collaborate, feel free to get in touch.

## 📄 License

MIT License — feel free to fork and adapt with credit.
