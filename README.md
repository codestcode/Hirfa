<img alt="Hirfa Logo" src="./Hirfa.png" height="700" />

# Craftsmen Maintenance Marketplace - حِرفة (Hirfa)

**A full-stack, mobile-first app, The all-in-one home services platform for the Arabic world. Browse verified craftsmen, compare prices, view before/after portfolios, book instantly, and track your orders , all from your phone.**

---

## Overview

Hirfa is a complete home maintenance platform built with Next.js 16 and Supabase. It serves three user types:

- **Clients** — Browse craftsmen and organizations, book services, request emergency help, manage orders and wallet
- **Craftsmen (Workers)** — Manage gallery with before/after photos, accept/reject orders, set services, manage schedule and payments
- **Organizations** — Manage a team of craftsmen under one brand, handle org bookings, assign workers, manage services and portfolio

---

## ✨ Features

### 🔐 Authentication & Onboarding

- Phone-based login with OTP verification
- Role selection (Client / Craftsman)
- Multi-step onboarding flow with splash, welcome, intro carousel, and success animation

### Client App

| Feature                  | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| **Home**                 | Category grid, featured craftsmen & organizations, nearby listings     |
| **Craftsman Profile**    | Full profile with before/after gallery, services, reviews, booking CTA |
| **Organization Profile** | Org profile with services catalog, portfolio gallery, workers, reviews |
| **Gallery Modal**        | Card-based photo viewer with navigation (before/after comparison)      |
| **Booking**              | 4-step wizard with date picker, time slots, address, payment method    |
| **Emergency SOS**        | Quick emergency booking with live tracking simulation                  |
| **Orders**               | Track orders — shows org name + worker name for org bookings           |
| **Invoice**              | Final invoice with org branding for org bookings                       |
| **Rating**               | Rate workers or organizations after completion                         |
| **Wallet**               | Deposit, cards management, transaction history                         |
| **Addresses**            | Saved addresses with CRUD                                              |
| **Search**               | Search craftsmen by name or profession                                 |
| **Notifications**        | Real-time notifications                                                |
| **Profile**              | Edit personal info, settings menu                                      |

### 🔧 Craftsman (Worker) App

| Feature           | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| **Home**          | Availability toggle, new requests, appointments, quick links          |
| **Orders**        | Accept/reject orders, update status, order cards with emergency badge |
| **Gallery**       | Add/delete before/after work photos with card modal                   |
| **Services**      | Manage offered services and pricing                                   |
| **Messages**      | Chat with clients                                                     |
| **Schedule**      | Manage availability and appointments                                  |
| **Notifications** | In-app notifications                                                  |
| **Profile**       | Edit info, verification status, payment methods, help, terms          |
| **Wallet**        | Earnings overview, withdrawals                                        |
| **Calendar**      | View booked appointments                                              |
| **Org Rating**    | Rating as part of an organization shown on profile                    |

### 🏢 Organization App

| Feature                    | Description                                                                      |
| -------------------------- | -------------------------------------------------------------------------------- |
| **Dashboard**              | Real-time stats (bookings, revenue, pending/completed), recent orders, rating    |
| **Orders Management**      | View all org bookings, accept/reject, assign workers, update tracking status     |
| **Worker Assignment**      | Assign org workers to bookings, search linked accounts, send notifications       |
| **Workers Management**     | Dedicated workers page — add, remove, search linked accounts, portfolio upload   |
| **Services Management**    | Manage org services and pricing                                                  |
| **Portfolio Gallery**      | Upload/remove org portfolio photos (up to 5)                                    |
| **Organization Profile**   | Create/edit org with name, category, city, logo, description                    |
| **Plan System**            | Free plan with worker limits, Pro plan for unlimited workers                    |
| **Wallet**                 | Org wallet with earnings, withdrawals, transaction history                       |
| **Messages**               | Chat with clients                                                                |
| **Settings**               | Org settings and configuration                                                   |

### Admin Dashboard

- User management, system rules, content moderation

---

## 🏢 Organization System

The platform supports a full organization management system where craftsmen can form organizations and manage teams.

### How It Works

1. **Worker creates an organization** via their profile → becomes the owner
2. **Owner adds workers** to the org (search by name/phone, link accounts)
3. **Clients browse** organizations alongside individual craftsmen
4. **Client books an org** → order appears in the org's dashboard
5. **Owner assigns a worker** to the booking
6. **Worker completes the job** → confirmation code flow
7. **Payment goes to the org owner's wallet** (not the individual worker)
8. **Client rates** → rating goes to both the worker and the organization

### Key Components

| Component                 | Description                                                              |
| ------------------------- | ------------------------------------------------------------------------ |
| **Org Profile (Client)**  | Services catalog, portfolio gallery (5 photos), workers list, reviews    |
| **Org Dashboard (Owner)** | Stats grid, recent orders, gallery management, quick actions             |
| **Org Orders**            | Full order list with worker assignment, tracking updates, status badges  |
| **Org Workers**           | Add/remove workers, search linked accounts, portfolio upload (4 photos)  |
| **Org Wallet**            | Earnings from all org bookings, transaction history, withdrawals         |
| **Org Booking Flow**      | Client selects org service → default schedule → org owner assigns worker |

### Database

- `organizations` — org profile with name, category, city, logo, plan, rating
- `organization_workers` — workers linked to an org (linked_user_id → auth.users)
- `organization_worker_portfolio` — portfolio photos per worker
- `organization_reviews` — client reviews for the org (auto-updated via trigger)
- `organization_gallery` — org portfolio photos
- `organization_services` — services offered by the org
- Bookings link to org via `organization_id` and `assigned_worker_id`

### Rating System

- Worker ratings: stored in `reviews` table, average on `profiles.rating`
- Org ratings: stored in `organization_reviews` table, average on `organizations.rating`
- **Auto-propagation**: when a worker review is inserted and the worker belongs to an org, a database trigger automatically inserts an org review — keeping org ratings in sync
- Workers see "تقييم كجزء من المؤسسة" (rating as part of organization) on their profile

### Payment Flow

- **Direct bookings**: money goes to the worker's wallet
- **Org bookings**: money goes to the org owner's wallet
- Commission rate determined by the recipient's subscription tier
- Transactions logged with `(مؤسسة)` label for org bookings

---

## Tech Stack

| Layer                    | Technology                          |
| ------------------------ | ----------------------------------- |
| **Framework**            | Next.js 16 (App Router, Turbopack)  |
| **Language**             | TypeScript                          |
| **Styling**              | Tailwind CSS v4 + custom dark theme |
| **Database**             | Supabase (PostgreSQL with RLS)      |
| **Auth**                 | Supabase Auth (phone OTP)           |
| **Icons**                | Lucide React                        |
| **Maps**                 | Leaflet / Mapbox GL                 |
| **Animations**           | Framer Motion                       |
| **Internationalization** | next-intl (Arabic RTL-first)        |
| **State**                | React Hooks + TanStack Query        |
| **UI Primitives**        | shadcn/ui + Base UI                 |

---

### Emergency SOS

One-tap emergency booking that auto-fills user address and creates an urgent order with real-time tracking simulation.

---


## 📱 Mobile App (Capacitor) & CI/CD

Hirfa is built as a mobile-first application and is compiled into a native Android APK using Capacitor.


---

## 📄 License

Hirfa Team — All rights reserved.

---

<p align="center">
  Built with ❤️ for the Arabic-speaking world<br/>
  <strong>حِرفة</strong> — لأن حرفتك تستحق الأفضل
</p>
