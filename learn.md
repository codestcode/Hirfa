# Learning Resources & Guide for Hirfa

Welcome to the learning guide for **Hirfa**! This document provides a roadmap for developers who want to understand the codebase, the technologies used, and how to contribute effectively.

## 📚 Core Technologies to Learn

To fully understand and work on Hirfa, you should familiarize yourself with the following technologies:

### 1. Next.js 16 (App Router)
- **Routing:** Understand how `app/` directory routing works, including route groups like `(auth)` and `(main)`.
- **Server vs Client Components:** Learn when to use `"use client"` and when to keep components on the server for better performance.
- **Data Fetching:** Explore how data fetching works in Server Components.

### 2. Tailwind CSS v4
- **Utility-First Styling:** Learn how to style components using utility classes directly in your JSX.
- **Custom Design Tokens:** See how our custom colors (e.g., Iron Blue, Ember Orange) and fonts are configured in `tailwind.config.ts` and `globals.css`.
- **RTL Support:** Understand how to use logical properties (like `ms-`, `me-`, `ps-`, `pe-`) to support Arabic Right-to-Left layouts seamlessly.

### 3. Supabase & PostgreSQL
- **Authentication:** Learn how Supabase Auth is integrated, specifically for phone OTP login.
- **Database Schema:** Familiarize yourself with how data is modeled (Users, Craftsmen, Bookings, Services).
- **Row Level Security (RLS):** Understand how data access is restricted securely based on the authenticated user.

### 4. Framer Motion
- **Animations:** See how we create smooth page transitions, stagger effects, and complex animations (like the emergency SOS radar) using `<motion.div>`.

### 5. TypeScript
- **Type Safety:** Review `lib/types.ts` to see how we strictly type our data models (Craftsman, Booking, User) to prevent runtime errors.

## 🗺️ Codebase Walkthrough

### Where to Start?
1. **The Entry Point:** Check `app/layout.tsx` to see the global providers, fonts (Cairo & Plus Jakarta Sans), and layout structure.
2. **Onboarding Flow:** Explore `app/(onboarding)` to see how the multi-step splash and welcome screens are built.
3. **Mock Data:** Look at `lib/mock-data.ts`. We currently use this to populate the UI. It's a great place to see the expected data structures.
4. **Shared Components:** Browse `components/shared/` for reusable UI elements like `CraftsmanCard` and `CategoryCard`.

## 🛠️ Recommended Learning Path

If you are new to this stack, we recommend this path:
1. Skim the [Next.js App Router Documentation](https://nextjs.org/docs/app).
2. Read about [Tailwind CSS logical properties](https://tailwindcss.com/docs/margin#logical-properties) for RTL optimization.
3. Review the Supabase docs on [Next.js Auth](https://supabase.com/docs/guides/auth/server-side/nextjs).
4. Run the app locally and try modifying the mock data in `lib/mock-data.ts` to instantly see how the UI updates.

Happy coding! 🚀
