# Thikana (ঠিকানা)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-cyan?logo=react)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack_Router-1.170-orange)](https://tanstack.com/router)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing%20(0%20errors)-brightgreen)]()

> **Hyperlocal Rental Housing Discovery System for Secondary Urban Centers in Bangladesh**  
> *Primary Academic Demonstration Context: Khulna City Corporation (KCC)*

**Thikana (ঠিকানা)** — meaning *"Address"* or *"Place"* in Bengali — is a specialized, production-ready academic web application designed to solve the critical information asymmetry, fragmented discovery, and trust deficits in Bangladesh's rental housing market. While metropolitan Dhaka has fragmented property portals, secondary urban centers like **Khulna** rely entirely on physical *"To-Let"* notice boards hung on gates, informal brokerage brokers (*dalaal*), and unverified social media posts. 

Thikana bridges this gap with a modern, mobile-first, **Bangla-first**, accessible discovery platform that prioritizes local rental realities, transparent deterministic matching, landlord operational autonomy, and platform governance.

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture & Business Rules (BR-01 – BR-07)](#architecture--business-rules)
- [Directory Structure](#directory-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [User Personas & Demo Workflows](#user-personas--demo-workflows)
- [100-Point Deterministic Match Rubric](#100-point-deterministic-match-rubric)
- [Academic Prototype Disclaimer](#academic-prototype-disclaimer)
- [License](#license)

---

## Key Features

### 🔍 Hyperlocal Rental Discovery
- Custom-tailored search and filtering for Khulna's primary residential sectors (**Sonadanga**, **Boyra**, **Khalishpur**, **Gollamari**, **Mujgunni**, **Nirala**, **Daulatpur**, **Rupsha**, **Khan Jahan Ali Road**).
- Real-world rental criteria: Monthly rent, Advance deposit (*Ogrim*), Service charge, Bachelor vs. Family tenant suitability, Gas connection type (Pipeline vs. Cylinder), Water supply, Generator backup, and Parking availability.

### 🇧🇩 Bangla-First Localization (BR-01)
- Deep, first-class native **Bangla (বাংলা)** localization across every single screen, dialog, form field, and error message.
- Instant, persistent language switcher allowing seamless toggling between Bangla and English.

### 👥 Multi-Persona RBAC & Instant Switcher (BR-02)
- Fast switcher in the navigation bar to test and experience the platform as:
  - **Guest / Public Explorer**: Search, filter, view public details, compare listings.
  - **Tenant (ভাড়াটিয়া)**: Set rental preferences, save favorites, compare side-by-side, send contact/visit inquiries, leave verified reviews.
  - **Landlord (বাড়িওয়ালা)**: Create detailed listings, directly control availability status, review tenant inquiries and visit requests.
  - **Admin (প্রশাসক)**: Review pending listings, manage user accounts, resolve reports, audit verification credentials.

### ⚡ Direct Landlord Availability Control (BR-03)
- Landlords have unilateral, instant control over their listing availability status (`available` 🟢, `reserved` 🟡, `rented` 🔴).
- Toggling availability status reflects immediately across the entire discovery portal **without requiring administrative re-approval**.

### 🛡️ Multi-Dimensional Simulated Verification (BR-04 & BR-06)
- Tiered verification badges (*Address Verified*, *Ownership Verified*, *Physical Inspection Completed*).
- **Academic Ethics Compliance**: All verification badges feature interactive disclaimer tooltips stating explicitly that credentials represent simulated platform validations rather than government-issued certifications.

### ⚖️ Side-by-Side Property Comparison
- Add up to 3 properties to a persistent comparison matrix.
- Compare rent, advance deposit, service charges, room count, floor level, utilities (gas, water, electricity), amenities, and verification states in a responsive grid.

### 🎯 Transparent 100-Point Deterministic Match Engine (BR-07)
- Computes mathematical match compatibility based on tenant profile preferences against listing parameters.
- **Zero Generative AI Hallucinations**: Uses a pure, explainable 100-point mathematical rubric across 7 weighted dimensions.

### 💬 Direct Inquiries & Visit Scheduling (BR-05)
- In-platform contact requests and visit scheduling with status lifecycles (`requested` → `confirmed` / `rejected` → `completed`).
- Dedicated conversation threads between tenants and landlords.

---

## Tech Stack

| Component | Technology | Version / Notes |
| :--- | :--- | :--- |
| **Framework** | [React](https://react.dev/) | 19.2.0 (Modern Concurrent Features) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.8.3 (Strict Mode, 0 Any Toleration) |
| **Routing & SSR** | [TanStack Router](https://tanstack.com/router) & [TanStack Start](https://tanstack.com/start) | File-based routing with SSR Nitro worker engine |
| **Build Engine** | [Vite](https://vite.dev/) | 8.1.5 with SSR bundle splitting |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | v4.2.1 with `@tailwindcss/vite` |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) | Headless, accessible dialogs, tooltips, select, accordion, tabs |
| **Icons** | [Lucide React](https://lucide.dev/) | Consistent semantic iconography |
| **State & Fetching** | [TanStack Query Core](https://tanstack.com/query) | Server state management and optimistic caching |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) | Type-safe schema validation |
| **Localization** | [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/) | Multi-locale dictionary management |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Accessible, non-blocking toast notifications |

---

## Architecture & Business Rules

The project strictly implements all architectural rules documented in `/docs` as the single source of truth:

```
┌────────────────────────────────────────────────────────┐
│                   Presentation Layer                   │
│  26 TanStack Start File Routes (Public, Tenant, Admin) │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    State & Context                     │
│  AuthContext │ LanguageContext │ Favorites │ Compare   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                 Domain Services Layer                  │
│ PropertiesService │ InteractionsService │ AdminService │
│            MatchingService (BR-07 Engine)              │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  Data & Storage Layer                  │
│ Typed HTTP API Client (Axios/Fetch) + Local Storage    │
└────────────────────────────────────────────────────────┘
```

### Core Business Rules Implementation

- **BR-01 (Bangla-First Localization)**: Bangla (`bn`) is the default language. All labels, placeholder values, and validation errors are localized via `src/i18n/bn.ts`.
- **BR-02 (RBAC & Persona Switcher)**: User roles (`guest`, `tenant`, `landlord`, `admin`) govern available actions, navigation links, and layout shells (`TenantLayout`, `LandlordLayout`, `AdminLayout`).
- **BR-03 (Direct Landlord Availability Control)**: Landlord status toggles (`available`, `rented`, `reserved`) do not alter administrative approval state.
- **BR-04 (Admin Listing Approvals)**: Newly submitted properties enter `pending` state until reviewed in `/admin/approvals`.
- **BR-05 (Tenant Inquiries & Interactions)**: Contact and visit requests trigger persistent records tracked in both Tenant and Landlord dashboards.
- **BR-06 (Simulated Verification Badges)**: Multi-attribute checks clearly labeled with academic prototype disclaimer tooltips.
- **BR-07 (Deterministic Matching Engine)**: Mathematical 100-point algorithm across 7 weighted dimensions.

---

## Directory Structure

```
d:/Thikana/frontend/
├── public/                     # Static public assets, icons, logos
├── src/
│   ├── components/
│   │   ├── dialogs/            # Contact, Visit, Report, and Review modals
│   │   ├── layout/             # Navbar, Footer, Tenant/Landlord/Admin layouts
│   │   ├── property/           # PropertyCard, Grid, Filters, Badges, MatchScore
│   │   └── ui/                 # Accessible Radix + Tailwind base components
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Authentication and Role/Persona state
│   │   ├── CompareContext.tsx  # Multi-property comparison state (up to 3)
│   │   ├── FavoritesContext.tsx# Saved properties state
│   │   └── LanguageContext.tsx # Re-export shim pointing to canonical i18n
│   ├── data/
│   │   └── mockData.ts         # Khulna locations, sample properties, amenities
│   ├── i18n/
│   │   ├── LanguageProvider.tsx# Canonical language context & synchronous t()
│   │   ├── bn.ts               # Primary Bangla translation dictionary
│   │   └── en.ts               # Secondary English translation dictionary
│   ├── routes/
│   │   ├── __root.tsx          # Root layout shell with Header, Toaster, Router
│   │   ├── index.tsx           # Home discovery portal
│   │   ├── how-it-works.tsx    # Workflow explainer
│   │   ├── login.tsx           # Authentication page
│   │   ├── register.tsx        # Role-based onboarding
│   │   ├── properties/
│   │   │   ├── index.tsx       # Search and filter property listing
│   │   │   └── $id.tsx         # Detailed single listing view
│   │   ├── tenant/             # Tenant portal (Dashboard, Preferences, Compare, etc.)
│   │   ├── landlord/           # Landlord portal (Dashboard, Properties, Create, etc.)
│   │   └── admin/              # Admin governance (Approvals, Reports, Users, etc.)
│   ├── services/
│   │   └── api/                # Modular API integration services
│   │       ├── http.ts         # Base HTTP client with error interceptors
│   │       ├── properties.service.ts
│   │       ├── interactions.service.ts
│   │       ├── matching.service.ts
│   │       └── admin.service.ts
│   ├── types/
│   │   ├── thikana.ts          # Canonical domain TypeScript models
│   │   └── property.ts         # Backward-compatible property model aliases
│   └── vite-env.d.ts           # Vite asset and environment type definitions
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Prerequisites

Ensure you have the following installed on your local development machine:

- **Node.js**: Version `20.x` or higher (minimum `18.x`)
- **Package Manager**: `npm` (included with Node.js) or `pnpm`
- **Git**: For version control

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Aqib2607/thikana.git
cd thikana/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

### 4. Typecheck Verification

Run the TypeScript compiler in `noEmit` mode to verify zero diagnostic errors:

```bash
npm run typecheck
```

### 5. Production Build & Preview

Compile the production-ready client bundle and SSR worker:

```bash
npm run build
npm run preview
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles both client static assets and Nitro SSR server bundle into `.output/`. |
| `npm run preview` | Starts a local server to preview the production build output. |
| `npm run typecheck` | Runs `tsc --noEmit` across all TypeScript files in strict mode. |
| `npm run lint` | Runs ESLint across the codebase for static code analysis. |
| `npm run format` | Runs Prettier to enforce consistent formatting across all code files. |

---

## User Personas & Demo Workflows

The top navigation bar features a **Role / Persona Switcher** dropdown. You can switch between roles instantly without re-logging in to test end-to-end workflows:

### 1. Tenant Workflow
1. Switch to **Tenant** in the top navigation.
2. Visit **[Find Properties](/properties)** and filter by *Sonadanga*, Rent range *৳12,000 - ৳25,000*, and *Family*.
3. Click the **Compare** icon on 2 or 3 listings, then navigate to **[Compare Properties](/tenant/compare)** to view their feature matrix.
4. Click **[Set Preferences](/tenant/preferences)** to configure your ideal property criteria; observe real-time **Match Score Badges** on properties.
5. On any listing page, click **Request Visit** or **Contact Landlord** to submit an inquiry.

### 2. Landlord Workflow
1. Switch to **Landlord** in the top navigation.
2. Go to **[Landlord Dashboard](/landlord/dashboard)** to view portfolio metrics.
3. Click **[Add New Property](/landlord/properties/create)** to fill out the 6-stage property creation form.
4. Go to **[My Properties](/landlord/properties)** and directly toggle the availability status between *Available*, *Reserved*, and *Rented*.
5. Go to **[Requests](/landlord/requests)** to review and accept/decline tenant contact inquiries.

### 3. Admin Workflow
1. Switch to **Admin** in the top navigation.
2. Visit **[Admin Dashboard](/admin/dashboard)** to view platform health metrics.
3. Navigate to **[Listing Approvals](/admin/approvals)** to inspect newly submitted listings and approve or reject them.
4. Navigate to **[Reports](/admin/reports)** to inspect and resolve user-flagged listings.

---

## 100-Point Deterministic Match Rubric

The platform's matching algorithm evaluates a tenant's preferences against a property listing using a transparent 100-point rubric:

```
Total Match Score = L + B + P + R + A + V + S (Max: 100 points)
```

| Dimension | Max Points | Scoring Criteria |
| :--- | :---: | :--- |
| **Location Match (L)** | **25 pts** | Exact area match = 25 pts; Same city/adjacent area = 15 pts; Different area = 0 pts. |
| **Budget Fit (B)** | **25 pts** | Rent within budget range = 25 pts; Up to 10% over max budget = 12 pts; >10% over = 0 pts. |
| **Property Type (P)** | **15 pts** | Exact property type (Family / Bachelor / Sublet / Office) = 15 pts; Otherwise = 0 pts. |
| **Rooms & Space (R)** | **15 pts** | Bedrooms >= preferred = 10 pts; Bathrooms >= preferred = 5 pts. |
| **Required Amenities (A)** | **10 pts** | Proportional score: `(matching_amenities / total_required_amenities) * 10 pts`. |
| **Availability Timing (V)** | **5 pts** | Available on or before desired move-in date = 5 pts. |
| **Advance / Security Deposit (S)** | **5 pts** | Advance deposit <= 2 months rent = 5 pts. |

---

## Academic Prototype Disclaimer

> **Important Notice for Evaluators & Users:**  
> **Thikana** is developed as an academic and technological prototype evaluating decentralized rental housing discovery in secondary urban centers of Bangladesh.  
> 1. Verification badges (*Address Verified*, *Ownership Verified*, *Physical Inspection Completed*) represent **simulated platform checks** designed for demonstration and architectural validation; they do **not** represent official government or legal guarantees.  
> 2. Contact and visit requests in this prototype operate over persistent browser mock stores with real REST API abstraction interfaces ready for production backend integration.

---

## License

This project is open-source software licensed under the **[MIT License](LICENSE)**.  
Copyright © 2026 Aqib2607 / Thikana Contributors.
