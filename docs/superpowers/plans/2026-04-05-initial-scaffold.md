# Initial Scaffold Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the first runnable PRZM frontend scaffold that matches the documented architecture and tech stack.

**Architecture:** Build a React + Vite + TypeScript application with thin routing, feature-oriented folders, shared selection context state, and a placeholder map-first home screen. Keep the initial scaffold minimal: enough structure to validate the stack, preserve the product shape, and support incremental feature work.

**Tech Stack:** React, Vite, TypeScript, React Router, Zustand, TanStack Query, Tailwind CSS

---

## Chunk 1: Workspace Bootstrap

### Task 1: Create root project configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `.gitignore`

- [ ] **Step 1: Add package metadata and scripts**
- [ ] **Step 2: Add TypeScript and Vite config**
- [ ] **Step 3: Add root HTML entry and ignore rules**
- [ ] **Step 4: Verify files are consistent**

### Task 2: Add Tailwind and styling bootstrap

**Files:**
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `src/app/styles/index.css`

- [ ] **Step 1: Add Tailwind/PostCSS config**
- [ ] **Step 2: Add global CSS entry with base theme variables**
- [ ] **Step 3: Verify CSS entry is wired to app bootstrap**

## Chunk 2: App Skeleton

### Task 3: Create app bootstrap and provider layer

**Files:**
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/providers/AppProviders.tsx`
- Create: `src/app/routes/AppRouter.tsx`

- [ ] **Step 1: Add React bootstrap entry**
- [ ] **Step 2: Add provider composition for router and query client**
- [ ] **Step 3: Add route table with `/` and `/about`**
- [ ] **Step 4: Verify route tree compiles conceptually**

### Task 4: Create architecture-aligned folders and shared primitives

**Files:**
- Create: `src/shared/types/domain.ts`
- Create: `src/shared/config/env.ts`
- Create: `src/shared/lib/cn.ts`
- Create: `src/shared/ui/Card.tsx`
- Create: `src/shared/ui/SectionHeading.tsx`

- [ ] **Step 1: Add shared domain types**
- [ ] **Step 2: Add basic config and utility helpers**
- [ ] **Step 3: Add minimal reusable UI primitives**

## Chunk 3: Product-Shaped Home Scaffold

### Task 5: Add selection context and mock domain data

**Files:**
- Create: `src/features/selection-context/store.ts`
- Create: `src/entities/region/model.ts`
- Create: `src/entities/disease/model.ts`
- Create: `src/entities/observation/model.ts`
- Create: `src/entities/forecast/model.ts`
- Create: `src/shared/constants/mockData.ts`

- [ ] **Step 1: Add entity types or mappers where needed**
- [ ] **Step 2: Add shared selection store with region/disease/age/panel state**
- [ ] **Step 3: Add mock data matching the product docs**

### Task 6: Add home page widgets and route pages

**Files:**
- Create: `src/pages/home/HomePage.tsx`
- Create: `src/pages/about/AboutPage.tsx`
- Create: `src/widgets/top-control-bar/TopControlBar.tsx`
- Create: `src/widgets/summary-card/SummaryCard.tsx`
- Create: `src/widgets/detail-panel/DetailPanel.tsx`
- Create: `src/features/map/MapViewport.tsx`

- [ ] **Step 1: Add top control bar bound to selection context**
- [ ] **Step 2: Add summary card and detail panel placeholders**
- [ ] **Step 3: Add map viewport placeholder matching wireframe shape**
- [ ] **Step 4: Compose the home page route**

## Chunk 4: Verification

### Task 7: Install dependencies and verify build

**Files:**
- Modify: `package-lock.json` or equivalent generated lockfile

- [ ] **Step 1: Run `npm install`**
- [ ] **Step 2: Run `npm run build`**
- [ ] **Step 3: Fix any scaffold-level compile issues**

Plan complete and saved to `docs/superpowers/plans/2026-04-05-initial-scaffold.md`. Ready to execute.
