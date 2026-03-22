# Decision DNA Tracker 🧬

**Decision DNA Tracker** is a production-ready tool designed for product teams to log the "why" behind every decision, track outcomes, and build a searchable institutional memory. Never lose the context of a decision again, even when team members move on.

## 🚀 Features

- **Decision Logging**: Capture problem statements, context, considered options (with pros/cons), and evidence.
- **Outcome Tracking**: Close the loop by logging actual results against your initial hypotheses.
- **Decision Graph**: Interactive D3.js visualization of decision dependencies and evolution.
- **The Graveyard**: Archive rejected ideas to prevent "zombie" proposals and learn from the past.
- **Workspace Management**: Multi-tenant support for different teams and projects.
- **Secure Invites**: Easily bring teammates into your workspace.
- **Email Reminders**: Automated review reminders via Resend to ensure no decision goes unevaluated.
- **Full-Text Search**: Instantly find past decisions using PostgreSQL full-text search.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Auth**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS
- **Visualization**: D3.js
- **Emails**: Resend
- **Icons**: Lucide React
- **Validation**: Zod

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ 
- A Neon PostgreSQL database
- A Resend API key
- Google OAuth credentials (optional, for social login)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anurag-mallick/decision-dna-tracker.git
   cd decision-dna-tracker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```

4. **Initialize the database**:
   ```bash
   npm run db:push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Anurag Mallick**
- [GitHub](https://github.com/anurag-mallick)
- [LinkedIn](https://www.linkedin.com/in/anuragmallick901/)

## 📄 License

This project is licensed under the MIT License.
