# Decision DNA Tracker 🧬
### *The Cognitive Backbone for High-Leverage Product Teams*

**Decision DNA Tracker** is a system for capturing, auditing, and scaling your team's collective intelligence. In fast-moving organizations, the *why* behind a decision is often more valuable than the *what*. When that context is lost to Slack threads or employee churn, teams suffer from "Decision Amnesia," leading to repetitive debates, unvalidated assumptions, and strategic drift.

This tool turns transient conversations into structured, searchable, and evaluative institutional memory.

---

## 🎯 The Problem: "Decision Amnesia"

Every organization suffers from three critical knowledge leaks:
1. **The Context Void:** A year from now, no one remembers why we chose *Vendor A* over *Vendor B*, or why we implemented *Feature X* with specific constraints.
2. **Zombie Proposals:** Bad ideas that were rightfully rejected 6 months ago are proposed again because the original rejection logic wasn't documented.
3. **The Feedback Gap:** Teams launch features and move to the next "big thing" without ever looking back to see if their initial hypothesis was actually correct.

## 💡 The Solution: A Living DNA Map

### 1. High-Fidelity Capture
Every decision is logged with its **Trigger**, **Context**, and **Problem Statement**. We record the **Options Considered** with pros and cons.

### 2. Hypothesis-Driven Thinking
State a clear **Hypothesis**: *"If we do X, we expect Y outcome by Z date."*

### 3. The Feedback Loop
Automated **Review Reminders** prompt owners to log the **Actual Outcome**.

### 4. Relational Intelligence (The Graph)
Visualize how decisions branch using an interactive force-directed graph.

### 5. The Graveyard
Archive rejected ideas so they stay dead. Search before proposing something new.

---

## 🛠 Strategic Impact
- **Onboarding Velocity:** New leads understand product strategy in days, not months.
- **Improved Decision Quality:** Documenting options and pros/cons reduces cognitive bias.
- **Knowledge Persistence:** Protect from the "Context Tax" when team members leave.

---

## 🚀 Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **PostgreSQL** (Neon) + **Drizzle ORM**
- **NextAuth v5** for authentication
- **D3.js** for decision graph visualization
- **Tailwind CSS v4** for styling
- **Sonner** for toast notifications

---

## 🏁 Getting Started

```bash
# Clone the repository
git clone https://github.com/anurag-mallick/decision-dna-tracker.git
cd decision-dna-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values:
# - DATABASE_URL (Neon PostgreSQL connection string)
# - AUTH_SECRET (generate with: openssl rand -base64 32)
# - AUTH_URL (http://localhost:3000 for local)
# - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (optional OAuth)
# - RESEND_API_KEY (for email notifications)

# Push database schema
npm run db:push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/app/[workspace]/     # Authenticated app routes
│   │   ├── dashboard/              # Stats & review table
│   │   ├── decisions/              # Decision CRUD & detail
│   │   ├── graph/                 # D3 decision graph
│   │   ├── graveyard/              # Rejected decisions
│   │   ├── search/                # Full-text search
│   │   └── settings/              # Workspace & member management
│   ├── (auth)/                    # Login & signup
│   ├── api/                       # API routes
│   └── page.tsx                   # Landing page
├── components/
│   ├── ui/                        # Reusable UI components
│   ├── layout/                    # Sidebar, topbar, workspace layout
│   ├── decisions/                 # Decision-specific components
│   ├── dashboard/                 # Dashboard widgets
│   └── graph/                     # Decision graph component
├── lib/
│   ├── auth.ts                    # NextAuth configuration
│   ├── db.ts                      # Drizzle database client
│   ├── schema.ts                  # Database schema
│   ├── utils.ts                   # Utility functions
│   └── validations.ts             # Zod schemas
└── hooks/                         # Custom React hooks
```

---

## 👨‍💻 Built by

**Anurag Mallick**
- [GitHub](https://github.com/anurag-mallick)
- [LinkedIn](https://www.linkedin.com/in/anuragmallick901/)

---

## 📄 License

MIT

*Stop repeating history. Start tracking your DNA.*
