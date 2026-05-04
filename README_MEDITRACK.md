# 🏥 MediTrack+ - Smart Medicine Reminder & Pharmacy Locator

A full-stack web application built with Next.js, Supabase, and Tailwind CSS to help users manage their daily medicines and locate nearby pharmacies.

## 🎯 Features

✅ **Medicine Management** - Add medicines with name, dosage, and time  
✅ **In-App Reminders** - Smart reminders using JavaScript timers  
✅ **Browser Notifications** - Get push notifications when it's time to take medicine  
✅ **Pharmacy Locator** - Find nearby pharmacies using geolocation and Google Maps  
✅ **Dashboard** - View all medicines and upcoming reminders at a glance  
✅ **Responsive Design** - Works on all devices (mobile, tablet, desktop)  

## 🛠️ Tech Stack

- **Frontend:** Next.js 16+ (App Router)
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Maps:** Google Maps API (optional for full functionality)
- **Notifications:** Browser Notification API

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free at [supabase.com](https://supabase.com))
- Google Maps API key (optional, for pharmacy locator)

## ⚙️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd meditrack-plus

# Install dependencies
npm install
```

### 2. Configure Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Copy your **Project URL** and **Anon Key** from project settings

### 3. Set Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key (optional)
```

### 4. Create Supabase Table

Go to Supabase dashboard → SQL Editor → Click "New query" → Paste this SQL:

```sql
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (Optional)
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
```

Execute the query.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages Overview

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Welcome page with feature overview |
| Add Medicine | `/add-medicine` | Form to add new medicines |
| Dashboard | `/dashboard` | View all medicines and reminders |
| Pharmacy Locator | `/pharmacy` | Find nearby pharmacies |

## 🚀 Usage Guide

### Adding a Medicine

1. Click **"Get Started"** or **"Add Medicine"** button
2. Fill in:
   - **Medicine Name:** e.g., "Aspirin"
   - **Dosage:** e.g., "500mg"
   - **Time:** e.g., "08:00" (24-hour format)
3. Click **"Add Medicine"**
4. You'll be redirected to Dashboard

### Viewing Medicines

1. Go to **Dashboard** (`/dashboard`)
2. See all your medicines in a table
3. Next scheduled medicine is highlighted at the top
4. Click **"Delete"** to remove a medicine

### Enabling Notifications

1. Go to Dashboard
2. You'll see notification status
3. Click **"Test Notification"** to enable and test
4. Browser will ask for permission - click **"Allow"**
5. You'll receive notifications when it's time to take medicine

### Finding Pharmacies

1. Click **"Find Pharmacy"** button
2. Allow browser to access your location
3. See nearby pharmacies with distances
4. Click **"Open in Maps"** to view on Google Maps

## 📂 Project Structure

```
meditrack-plus/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── add-medicine/
│   │   └── page.tsx          # Add medicine form
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard with medicine list
│   ├── pharmacy/
│   │   └── page.tsx          # Pharmacy locator
│   └── api/
│       └── medicines/
│           └── route.ts      # API routes (GET, POST, DELETE)
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   └── useReminder.ts        # Reminder hook with notifications
├── public/                   # Static files
├── .env.local.example        # Environment variables template
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind CSS config
└── README.md                 # This file
```

## 🔑 API Endpoints

### GET /api/medicines
Fetch all medicines ordered by time

```bash
curl http://localhost:3000/api/medicines
```

### POST /api/medicines
Add a new medicine

```bash
curl -X POST http://localhost:3000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{"name":"Aspirin","dosage":"500mg","time":"08:00"}'
```

### DELETE /api/medicines
Delete a medicine by ID

```bash
curl -X DELETE http://localhost:3000/api/medicines \
  -H "Content-Type: application/json" \
  -d '{"id":"uuid-here"}'
```

## 🎨 Customization

### Change Colors
Edit Tailwind color classes in:
- `app/page.tsx` (Home)
- `app/add-medicine/page.tsx` (Form)
- `app/dashboard/page.tsx` (Dashboard)
- `app/pharmacy/page.tsx` (Maps)

### Add Database Fields
To add more fields (e.g., frequency, notes):

1. Update SQL table in Supabase
2. Update `Medicine` type in `lib/supabase.ts`
3. Update form in `app/add-medicine/page.tsx`
4. Update API route in `app/api/medicines/route.ts`

### Integrate Real Google Maps
1. Get API key from [Google Cloud Console](https://console.cloud.google.com)
2. Add to `.env.local`
3. Install: `npm install @react-google-maps/api`
4. Update `app/pharmacy/page.tsx` with Google Maps component

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" → Select your repository
4. Add environment variables in Vercel dashboard
5. Click "Deploy"

### Deploy to Other Platforms

The project is a standard Next.js app. You can deploy to:
- Netlify
- AWS Amplify
- Railway
- Render
- DigitalOcean

## 🐛 Troubleshooting

### Medicines not saving?
- Check Supabase credentials in `.env.local`
- Verify table exists in Supabase
- Check browser console for errors

### Notifications not working?
- Ensure browser notification permission is granted
- Some browsers require HTTPS (production)
- Check browser console for errors

### Pharmacy locator not showing map?
- Google Maps API requires API key and billing setup
- Check `.env.local` has correct key
- Ensure "Maps JavaScript API" is enabled in Google Cloud

### Localhost shows blank page?
- Clear browser cache
- Try `npm run build && npm start`
- Check console for errors (F12)

## 🔒 Security Notes

- Store sensitive data only in environment variables
- Never commit `.env.local` to Git
- Use Supabase Row Level Security for user data
- Validate all inputs on backend

## 📝 Development Workflow

### Git Commits Strategy

```bash
# Step 1: Initial setup
git add .
git commit -m "Initial Next.js setup"
git push

# Step 2: Add medicine UI
git add app/add-medicine
git commit -m "Add medicine form UI"
git push

# Step 3: Supabase integration
git add lib/supabase.ts .env.local.example
git commit -m "Integrate Supabase client"
git push

# Step 4: API routes
git add app/api/medicines
git commit -m "Add medicines API routes"
git push

# Step 5: Dashboard
git add app/dashboard
git commit -m "Add dashboard with medicine list"
git push

# Step 6: Reminder system
git add lib/useReminder.ts
git commit -m "Add reminder system with notifications"
git push

# Step 7: Pharmacy locator
git add app/pharmacy
git commit -m "Add pharmacy locator with geolocation"
git push
```

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Maps API](https://developers.google.com/maps/documentation)

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📄 License

MIT License - feel free to use for personal or commercial projects

---

**Made with ❤️ for better medicine management**
