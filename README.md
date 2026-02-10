# ZeroDay Classes Platform

![ZeroDay Banner](https://via.placeholder.com/1200x400.png?text=ZeroDay+Classes+Platform)

**ZeroDay Classes** is a next-generation ed-tech platform designed for government exam aspirants in Odisha. Built with a "Cyber-Aesthetic" design language, it combines premium visuals with powerful tools for learning and assessment.

## 🚀 Key Features

### 1. 🖥️ Cyber-Aesthetic UI
-   **Dark Mode Native**: Deep charcoal theme with neon accents (Electric Green, Cyber Blue).
-   **Glassmorphism**: Modern, translucent UI components.
-   **Animations**: Framer Motion powered transitions, 3D tilt effects, and typing animations.

### 2. 📝 OSSC CGL Mock Test System (`/mock-test/ossc-cgl`)
-   **Full-Length Simulation**: 150 Questions covering Math, Reasoning, DI, Computer, Odisha GK, and Current Affairs.
-   **Real Exam Environment**:
    -   120-minute countdown timer.
    -   Negative marking (-0.25).
    -   Question Palette & "Mark for Review".
-   **Analytics**:
    -   Detailed Section-wise analysis.
    -   **PDF Report Generation**: Downloadable exam certificates/cards.
    -   **Local Leaderboard**: Compare scores with recent attempts.

### 3. 💼 Odisha Career Center (`/odisha-jobs`)
-   **Job Alerts Feed**: Latest updates for OSSC, OPSC, Railway, and Banking jobs.
-   **Smart Job Cards**:
    -   **Urgency Indicators**: Visual cues for "Closing Soon" jobs.
    -   **"New" Badges**: Animated indicators for fresh posts.
-   **Productivity Tools**:
    -   **Add to Calendar**: One-click .ics generation for application deadlines.
    -   **WhatsApp Share**: Instantly share opportunities with friends.
-   **Filters**: Smart filtering by Organization and Qualification.

### 4. 📊 Student Dashboard (`/dashboard`)
-   **Progress Tracking**: XP System, Modules completed, and "Machines Pwned".
-   **Certificates**: Repository of earned credentials.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + `clsx` + `tailwind-merge`
-   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **PDF Generation**: `jspdf` + `jspdf-autotable`
-   **Utilities**: `date-fns`, `canvas-confetti`

## 🏃‍♂️ Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/webspoit/zeroday-classes.git
    cd zeroday-classes
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router Pages
│   │   ├── dashboard/       # Student Dashboard
│   │   ├── mock-test/       # Exam Systems (OSSC CGL)
│   │   ├── odisha-jobs/     # Career Center
│   │   └── page.tsx         # Landing Page
│   ├── components/          # Reusable UI Components
│   │   ├── Jobs/            # Job Card & related components
│   │   ├── OSSCQuiz/        # Quiz Interface & Logic
│   │   └── ui/              # Shadcn Primitives
│   ├── data/                # Mock Data (Questions, Jobs)
│   └── lib/                 # Utilities
├── public/                  # Static Assets
└── prisma/                  # Database Schema
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
