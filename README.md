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
app/
├── (auth)/                      # Authentication routes
│   ├── login/page.tsx          # Phone + password login
│   ├── register/page.tsx       # User registration (ready)
│   ├── otp/page.tsx            # OTP verification (6-digit)
│   └── forgot-password/         # Password recovery (ready)
├── (onboarding)/                # Initial user flows
│   ├── splash/page.tsx         # 2.5s loading screen
│   ├── welcome/page.tsx        # Hero + CTA
│   ├── intro/[step]/page.tsx   # 3-step carousel
│   ├── language/page.tsx       # Language selection (ready)
│   ├── location/page.tsx       # Location setup (ready)
│   └── success/page.tsx        # Animated success
├── (main)/                      # Core app routes
│   ├── layout.tsx              # Bottom navigation + RTL
│   ├── home/page.tsx           # Dashboard + emergency banner
│   ├── search/page.tsx         # Advanced search (ready)
│   ├── search/results/         # Filtered results (ready)
│   ├── search/map/             # Map view (ready)
│   ├── craftsman/[id]/         # Full profile + reviews
│   ├── booking/new/            # 4-step booking wizard
│   ├── booking/[id]/           # Booking details (ready)
│   ├── booking/success/        # Confirmation screen
│   ├── emergency/              # Emergency landing
│   ├── emergency/tracking/[id] # Live tracking with map
│   ├── bookings/               # My bookings (4 tabs)
│   ├── messages/[id]           # Chat (ready)
│   ├── notifications/          # Notification center (ready)
│   ├── profile/                # Profile & settings
│   ├── profile/edit/           # Edit profile (ready)
│   ├── profile/addresses/      # Saved addresses (ready)
│   ├── profile/payments/       # Payment methods (ready)
│   ├── profile/help/           # FAQ (ready)
│   ├── favorites/              # Saved craftsmen (ready)
│   └── payments/               # Checkout (ready)
└── page.tsx                     # Root redirect to splash

components/
├── ui/                          # shadcn/ui primitives
│   └── button.tsx, input.tsx, etc.
└── shared/                      # Domain components
    ├── CraftsmanCard.tsx       # Craftsman display (compact/full)
    ├── CategoryCard.tsx        # Service category
    ├── OTPInput.tsx            # 6-digit OTP boxes
    ├── VerificationBadge.tsx   # Tier badges (ready)
    ├── BookingCard.tsx         # Booking list item (ready)
    ├── StatusChip.tsx          # Status badges (ready)
    ├── RatingStars.tsx         # Star ratings (ready)
    ├── ReviewCard.tsx          # Review display (ready)
    └── MapView.tsx             # Map integration (ready)

lib/
├── types.ts                     # TypeScript interfaces
├── mock-data.ts                 # Sample craftsmen, bookings, users
└── utils.ts                     # Utility functions

globals.css                       # Design tokens + Tailwind config
layout.tsx                        # Root layout + fonts + metadata
