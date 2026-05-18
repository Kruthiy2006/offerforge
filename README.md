# 🔥 OfferForge AI — Smart Offer Letter Builder

A professional AI-powered Offer Letter Generation Platform for HR teams. Built with React, Express.js, MySQL, and Groq AI.

## ✨ Features

- **📊 Dashboard** — Real-time analytics with interactive charts, offer metrics, and quick actions
- **👥 Candidate Management** — Full CRUD with search, filtering, and status tracking
- **📝 Template Builder** — Reusable templates with dynamic `{{placeholder}}` system
- **🤖 AI-Powered Generation** — Professional offer content generated using Groq LLaMA 3.3
- **📄 Professional PDFs** — Multi-page corporate offer letters with headers, tables, signatures, and watermarks
- **📋 Offer History** — Complete offer lifecycle tracking with status updates
- **🔐 Offer Verification** — Instant verification using unique offer IDs
- **🌙 Dark/Light Mode** — Premium UI with purple/indigo gradients and glassmorphism

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| Database | MySQL |
| PDF | PDFKit |
| AI | Groq API (LLaMA 3.3 70B) |

## 📁 Project Structure

```
OfferForge/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/            # API client (Axios)
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles & design system
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                # Express.js backend
│   ├── config/             # Database configuration
│   ├── routes/             # API route handlers
│   │   ├── candidates.js
│   │   ├── templates.js
│   │   ├── offers.js
│   │   ├── verify.js
│   │   └── dashboard.js
│   ├── services/           # Business logic
│   │   ├── aiService.js    # Groq AI integration
│   │   └── pdfService.js   # PDFKit PDF generation
│   ├── scripts/
│   │   └── initDb.js       # Database initialization
│   ├── server.js           # Express server entry
│   ├── .env.example
│   └── package.json
│
├── database/               # SQL files
│   ├── schema.sql          # Table definitions
│   └── seed.sql            # Sample data
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+
- **MySQL** 8.0+
- **npm** v9+

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
cp .env.example .env
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup MySQL Database

```bash
# Create the database
mysql -u root -e "CREATE DATABASE IF NOT EXISTS offerforge;"

# Initialize schema and seed data
cd backend
npm run db:init
```

### 3. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=offerforge

# Optional: Groq AI API key (get free at https://console.groq.com)
GROQ_API_KEY=your_groq_api_key
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📡 API Endpoints

### Candidates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/candidates` | List all candidates |
| POST | `/api/candidates` | Create candidate |
| PUT | `/api/candidates/:id` | Update candidate |
| DELETE | `/api/candidates/:id` | Delete candidate |

### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | List all templates |
| POST | `/api/templates` | Create template |

### Offers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/offers` | List all offers |
| POST | `/api/offers` | Generate new offer |
| GET | `/api/offers/:id` | Get offer details |
| PATCH | `/api/offers/:id/status` | Update offer status |
| GET | `/api/offers/:id/pdf` | Download offer PDF |

### Verification
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/verify/:id` | Verify offer by ID |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard analytics |

## 🎨 Design

- **Theme**: Purple/Indigo gradients with glassmorphism
- **Inspiration**: Stripe, Notion, Linear, Vercel
- **Typography**: Inter (Google Fonts)
- **Dark Mode**: Full dark/light theme support
- **Animations**: Framer Motion page transitions and micro-interactions

## 📄 PDF Features

Generated PDFs include:
- Gradient colored header with company branding
- Professional typography and formatting
- Position details table
- Compensation breakdown (annual, monthly, bi-weekly)
- Employee benefits by category (Health, Financial, Time Off, Growth)
- Terms & conditions (7 sections)
- Confidentiality and IP clauses
- Dual signature blocks (HR + Candidate)
- Page numbers and footers
- "CONFIDENTIAL" watermark
- 3+ pages of professional content

## 🤖 AI Integration

The platform uses **Groq API** with **LLaMA 3.3 70B** to:
- Generate professional HR language
- Create role-specific descriptions
- Customize employment clauses
- Enhance template content with AI

> **Note**: AI features work without an API key — the system falls back to professional template-based content.

## 📝 License

MIT License — Built for hackathons 🏆
