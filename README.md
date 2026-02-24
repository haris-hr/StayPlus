# StayPlus - Guest Services SaaS Platform

A multi-tenant SaaS platform for short-term rental hosts that allows guests to browse and request add-on services through a beautiful, mobile-first portal.

## Features

- **Guest Portal**: Beautiful, mobile-first interface for guests to browse and request services
- **Super Admin Dashboard**: Manage tenants, services, categories, and requests
- **Tenant Dashboard**: Read-only overview for property hosts
- **Multi-tenant**: Each property gets a unique URL (e.g., `/apartment/sunny-sarajevo`)
- **Full i18n Support**: English and Bosnian translations
- **White-label Branding**: Custom logo, colors, and domain per tenant

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google login)
- **Styling**: Tailwind CSS + Framer Motion
- **i18n**: next-intl
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stayplus.git
cd stayplus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   └── [locale]/           # i18n routing
│       ├── page.tsx        # Marketing homepage
│       ├── apartment/
│       │   └── [slug]/     # Guest portal
│       ├── admin/          # Super admin dashboard
│       └── dashboard/      # Tenant dashboard
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── guest/              # Guest portal components
│   ├── admin/              # Admin components
│   └── marketing/          # Landing page components
├── lib/
│   ├── firebase/           # Firebase config & helpers
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── i18n/
│   ├── en.json             # English translations
│   └── bs.json             # Bosnian translations
└── types/                  # TypeScript types
```

## Service Categories

1. **Free Amenities** - Water, Coffee, Snacks, Borrowed Items
2. **Transport** - Airport Transfer, Rent a Car, Taxi, Private Driver
3. **Tours & Activities** - Erma Safari, Day Trips (Mostar, Konjic, Travnik, Jajce)
4. **Food & Dining** - Breakfast, Grocery Pre-stock, Private Chef
5. **Special Occasions** - Romantic Setup, Birthday, Proposal
6. **Convenience** - Shopping Run, Pharmacy, Currency Exchange
7. **Car Services** - Car Wash, Detailing
8. **Extras** - Photographer

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Authentication with Google provider
4. Add your web app and copy the configuration
5. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to active tenants and their services
    match /tenants/{tenantId} {
      allow read: if resource.data.active == true;
    }
    
    match /services/{serviceId} {
      allow read: if resource.data.active == true;
    }
    
    match /serviceCategories/{categoryId} {
      allow read: if resource.data.active == true;
    }
    
    // Allow creating requests (for guests)
    match /requests/{requestId} {
      allow create: if true;
      allow read, update: if request.auth != null;
    }
    
    // Admin access
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted with `npm run build && npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

---

Built with ❤️ for the hospitality industry
# StayPlus
