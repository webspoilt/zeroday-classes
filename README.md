# ZeroDay Classes — Odisha Exam Prep Platform

![ZeroDay Classes Banner](public/logo.png)

A comprehensive, free exam preparation platform for Odisha government exams (OSSC CGL, OSSSC RI/ARI/Amin, OPSC) and coding tutorials. Built with **Next.js 15**, **Supabase**, and **TailwindCSS**.

## 🚀 Features

- **Mock Tests**: Full-length OSSC CGL simulations with 150 questions (Math, Reasoning, DI, Computer, GK, CA).
- **Job Alerts**: Real-time tracking of Odisha government job vacancies.
- **Coding Tutorials**: Integrated YouTube learning resources.
- **Admin Dashboard**: Manage questions, tests, and job postings.
- **Responsive Design**: Mobile-first UI with dark mode support.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Lucide React, Framer Motion
- **Styling**: TailwindCSS v4, Shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Deployment**: Vercel

## ⚙️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/webspoilt/zeroday-classes.git
    cd zeroday-classes
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🌱 Database Seeding

To populate the database with initial data (Mock Tests & Job Posts), run:

```bash
npm run seed
```

This script is safe to run multiple times (it skips existing data).

## 📂 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── layout/          # NavBar, Footer
│   ├── ui/              # Reusable UI elements
│   └── ...
├── data/                # Static data (questions, jobs)
├── lib/                 # Utilities & Supabase client
└── scripts/             # CLI tools (seeding, maintenance)
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

MIT License © 2024 ZeroDay Classes
