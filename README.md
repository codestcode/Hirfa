<img alt="Hirfa Logo" src="./Hirfa.png" height="700" />

# craftsmen Maintenance Marketplace - حِرفة (Hirfa)

**A full-stack, mobile-first app, The all-in-one home services platform for the Arabic world. Browse verified craftsmen, compare prices, view before/after portfolios, book instantly, and track your orders , all from your phone.**

---

## Overview

Hirfa is a complete home maintenance platform built with Next.js 16 and Supabase. It serves two user types:

- **Clients** — Browse craftsmen, book services, request emergency help, manage orders and wallet
- **Craftsmen (Workers)** — Manage gallery with before/after photos, accept/reject orders, set services, manage schedule and payments

---

## ✨ Features

### 🔐 Authentication & Onboarding

- Phone-based login with OTP verification
- Role selection (Client / Craftsman)
- Multi-step onboarding flow with splash, welcome, intro carousel, and success animation

### Client App

| Feature               | Description                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| **Home**              | Category grid, featured craftsmen, nearby listings                     |
| **Craftsman Profile** | Full profile with before/after gallery, services, reviews, booking CTA |
| **Gallery Modal**     | Card-based photo viewer with navigation (before/after comparison)      |
| **Booking**           | 4-step wizard with date picker, time slots, address, payment method    |
| **Emergency SOS**     | Quick emergency booking with live tracking simulation                  |
| **Orders**            | Track order status (pending → confirmed → completed)                   |
| **Wallet**            | Deposit, cards management, transaction history                         |
| **Addresses**         | Saved addresses with CRUD                                              |
| **Search**            | Search craftsmen by name or profession                                 |
| **Notifications**     | Real-time notifications                                                |
| **Profile**           | Edit personal info, settings menu                                      |

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

### Admin Dashboard

- User management, system rules, content moderation

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

## 📁 Project Structure

```
Hirfa/
├── app/
│   ├── (auth)/                   # Login, register, OTP, verification
│   ├── (main)/                   # Worker pages (home, orders, gallery, etc.)
│   ├── (onboarding)/             # Splash, welcome, intro, success
│   ├── admin/                    # Admin dashboard
│   ├── api/                      # Supabase API routes
│   ├── client/                   # Client pages (craftsman, booking, wallet, etc.)
│   ├── globals.css               # Global styles + design tokens
│   ├── layout.tsx                # Root layout with RTL and fonts
│   └── page.tsx                  # Splash redirect
├── components/
│   ├── auth/                     # ProtectedRoute, Route guards
│   ├── shared/                   # CraftsmanCard, CategoryCard, OTPInput
│   └── ui/                       # BeforeAfterCard, ImageUploader, modals, etc.
├── contexts/                     # AuthContext
├── hooks/                        # useGallery, useCraftsmanProfile, etc.
├── lib/                          # Types, utils, Supabase client/server
├── services/                     # Auth and profile services
├── supabase/                     # Migrations, schema
└── public/                       # Static assets
```

---

### Emergency SOS

One-tap emergency booking that auto-fills user address and creates an urgent order with real-time tracking simulation.

---

---

## 📄 License

Hirfa Team — All rights reserved.

---

<p align="center">
  Built with ❤️ for the Arabic-speaking world<br/>
  <strong>حِرفة</strong> — لأن حرفتك تستحق الأفضل
</p>
