# حِرفة (Hirfa) - Arabic Home Maintenance Marketplace

A complete Next.js 16 mobile-first marketplace app connecting homeowners with verified craftsmen in Arabic-speaking regions.

## Project Overview

Hirfa is a full-stack Arabic-first home maintenance platform featuring real-time craftsman tracking, multi-step booking flows, emergency services, and integrated payments. The app emphasizes trust and convenience through verified craftsman profiles, customer reviews, and transparent pricing.

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 + custom design tokens
- **UI Components**: shadcn/ui (Button, Input)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Internationalization**: next-intl (prepared for Arabic/English toggle)
- **State Management**: React Hooks + SWR ready
- **Type Safety**: TypeScript
- **Design System**: Material Design 3 colors (Iron Blue #3854cd, Ember Orange #f3830c)

## Project Structure

```
Hirfa/
├── app/
│   ├── (auth)
│   │   ├── Proffession/
│   │   │   └── page.tsx
│   │   ├── Verification/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── otp/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (main)
│   │   ├── booking/
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   ├── bookings/
│   │   │   └── page.tsx
│   │   ├── craftsman/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── emergency/
│   │   │   ├── page.tsx
│   │   │   └── tracking/
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (onboarding)
│   │   ├── intro/
│   │   │   └── [step]/
│   │   │       └── page.tsx
│   │   ├── splash/
│   │   │   └── page.tsx
│   │   ├── success/
│   │   │   └── page.tsx
│   │   └── welcome/
│   │       └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── shared/
│   │   ├── CategoryCard.tsx
│   │   ├── CraftsmanCard.tsx
│   │   └── OTPInput.tsx
│   └── ui/
│       ├── button.tsx
│       └── input.tsx
│
├── lib/
│   ├── mock-data.ts
│   ├── types.ts
│   └── utils.ts
