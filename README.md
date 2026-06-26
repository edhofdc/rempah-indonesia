# 🌿 REMPAH INDONESIA — Authentic Spices E-Commerce

A full-featured **e-commerce platform** for Indonesian spices built with Next.js 15, React 19, TypeScript, Tailwind CSS, and shadcn/ui.

**Live Development:** `http://localhost:8890`
**Admin Panel:** `http://localhost:8890/admin/login` (`admin / admin123`)

---

## 🚀 Tech Stack

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| **Framework**  | Next.js 15 (App Router)                    |
| **UI Library** | React 19                                   |
| **Language**   | TypeScript (strict)                        |
| **Styling**    | Tailwind CSS + shadcn/ui                   |
| **Database**   | SQLite (via Prisma ORM + libSQL)           |
| **Auth**       | JWT (bcryptjs + jose)                      |
| **Forms**      | React Hook Form + Zod validation           |
| **State**      | Zustand                                    |
| **Design**     | Spice branding (green, brown, cream, gold) |

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── products/           # Public product catalog
│   ├── about/              # About page
│   ├── gallery/            # Gallery page
│   ├── contact/            # Contact form
│   ├── faq/                # FAQ page
│   └── admin/              # Admin dashboard (JWT protected)
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utilities, helpers
│   └── middleware.ts       # JWT auth middleware (Edge Runtime)
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── seed.ts             # Seed data
│   └── dev.db              # SQLite database
└── public/                 # Static assets
```

## ✨ Features

### Public Pages

- **Homepage** — Hero section, featured products, testimonials, newsletter
- **Products** — Product catalog with spices catalogue and search
- **About** — Company story and values
- **Gallery** — Image gallery showcasing spices
- **Contact** — Contact form with WhatsApp checkout integration
- **FAQ** — Accordion-style FAQ

### Admin Dashboard (JWT Protected)

- **Dashboard** — Sales overview, low stock alerts, recent orders
- **Products** — Manage product inventory (CRUD)
- **Categories** — Manage product categories
- **Orders** — View and manage orders
- **Settings** — Admin configuration
- **FAQ** — Manage FAQ entries

### Security

- JWT-based authentication with Edge Runtime support (`jose`)
- Middleware protects all `/api/admin/*` routes (returns 401)
- Password hashing with bcryptjs
- Input validation (Zod)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
cd /home/edho/mycodingproject/rempah-indonesia

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migration
npx prisma db push

# Seed the database
npm run seed

# Start dev server
npm run dev
# → http://localhost:8890
```

### Admin Access

- **URL:** `http://localhost:8890/admin/login`
- **Username:** `admin`
- **Password:** `admin123`

## 📡 API Endpoints

| Method | Endpoint                | Auth | Description         |
| ------ | ----------------------- | ---- | ------------------- |
| GET    | `/api/products`         | No   | List all products   |
| GET    | `/api/products/[id]`    | No   | Product detail      |
| GET    | `/api/categories`       | No   | List categories     |
| POST   | `/api/auth`             | No   | Login (returns JWT) |
| GET    | `/api/auth`             | No   | Verify JWT          |
| GET    | `/api/admin/dashboard`  | JWT  | Dashboard stats     |
| GET    | `/api/admin/products`   | JWT  | Admin product list  |
| POST   | `/api/admin/products`   | JWT  | Create product      |
| GET    | `/api/admin/categories` | JWT  | Admin category list |
| GET    | `/api/admin/orders`     | JWT  | Order management    |
| GET    | `/api/admin/settings`   | JWT  | Settings            |
| GET    | `/api/admin/faq`        | JWT  | FAQ management      |
| POST   | `/api/admin/faq`        | JWT  | Create FAQ          |

## 🧪 QA Automation

Browser-level functional testing via LangGraph service:

```bash
curl -X POST http://127.0.0.1:8000/qa-automation \
  -d '{"url": "http://localhost:8890", "test_auth": true}'
```

Tests 13 routes across console errors, network errors, DOM rendering, and auth flow.

## 📦 Tech Debt & Roadmap

- [ ] Dockerfile + docker-compose deployment
- [ ] AI chatbot integration (LangGraphJS)
- [ ] Production database (PostgreSQL)
- [ ] Vercel deployment
- [ ] Unit/E2E test suite
- [ ] CI/CD pipeline

## 📝 License

MIT — feel free to use, modify, and distribute.
