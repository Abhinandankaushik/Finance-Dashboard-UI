# FinDash — Project Planning Document

## Table of Contents

1. [Project Overview](#project-overview)
2. [Planning Approach](#planning-approach)
3. [Architecture Decisions](#architecture-decisions)
4. [Component Breakdown](#component-breakdown)
5. [State Management Strategy](#state-management-strategy)
6. [Data Layer Design](#data-layer-design)
7. [UI/UX Design Decisions](#uiux-design-decisions)
8. [Feature Implementation Plan](#feature-implementation-plan)
9. [Optional Enhancements](#optional-enhancements)
10. [Testing & Quality](#testing--quality)
11. [Summary](#summary)

---

## 1. Project Overview

### What?
**FinDash** is an interactive personal finance dashboard that allows users to track income, expenses, and spending patterns through rich visualizations and a comprehensive transaction management interface.

### Why?
The goal is to demonstrate frontend engineering competency — clean component architecture, effective state management, responsive design, and attention to user experience — within the context of a realistic fintech application.

### Who is the user?
A person who wants a quick, intuitive overview of their financial health without navigating complex banking interfaces.

---

## 2. Planning Approach

### Step 1: Requirement Analysis
**What I did:** Read through every requirement and categorized them into three tiers:
- **Core** — Dashboard overview, transactions, role-based UI, insights, state management
- **UX** — Responsiveness, empty states, accessibility
- **Optional** — Dark mode, persistence, mock API, animations, export, advanced filtering

**Why:** Prioritization ensures the most impactful features are built first. Optional enhancements are layered on top without affecting core stability.

**Benefit:** Prevents scope creep and ensures a working product at every stage.

### Step 2: Technology Selection
**What I chose:**
| Concern | Choice | Why |
|---------|--------|-----|
| Framework | React 18 | Component-driven, massive ecosystem, hooks for clean logic |
| Build Tool | Vite 5 | Near-instant HMR, faster than CRA/Webpack |
| Styling | Tailwind CSS v3 | Utility-first, rapid prototyping, built-in dark mode support |
| Charts | Recharts | React-native charting, composable, responsive out of the box |
| UI Primitives | shadcn/ui + Radix | Accessible, unstyled headless components — full design control |
| State | React Context + useReducer pattern | Sufficient for this scale; no Redux boilerplate overhead |
| Routing | React Router v6 | Standard SPA routing |

**Benefit:** Every tool was chosen to maximize development speed while maintaining production-quality output.

### Step 3: Project Structure Planning
```
src/
├── components/
│   ├── dashboard/          # Feature-specific components
│   │   ├── SummaryCards.tsx
│   │   ├── BalanceTrend.tsx
│   │   ├── SpendingBreakdown.tsx
│   │   ├── TransactionsTable.tsx
│   │   ├── InsightsPanel.tsx
│   │   ├── RoleToggle.tsx
│   │   ├── DarkModeToggle.tsx
│   │   └── AddTransactionDialog.tsx
│   └── ui/                 # Reusable UI primitives (shadcn)
├── context/
│   └── FinanceContext.tsx   # Global state provider
├── data/
│   └── mockData.ts         # Data generation
├── services/
│   └── api.ts              # Mock API layer
├── pages/
│   └── Index.tsx            # Main dashboard page
└── index.css                # Design tokens & global styles
```

**Why this structure?**
- **Separation of concerns:** UI primitives live separately from business components.
- **Scalability:** Adding a new dashboard widget means adding one file in `components/dashboard/`.
- **Testability:** Context, services, and components can be tested independently.

**Benefit:** Any developer can navigate the codebase and understand where things belong within seconds.

---

## 3. Architecture Decisions

### Decision 1: Context API over Redux/Zustand
**What:** Used React Context with a provider pattern for global state.

**Why:** The app has a single data domain (financial transactions). Redux would introduce unnecessary boilerplate (actions, reducers, store configuration). Zustand is excellent but adds a dependency for what Context handles cleanly here.

**How:** `FinanceContext.tsx` wraps the app, exposing transactions, filters, role, and mutation functions. Components consume via `useFinance()` hook.

**Benefit:** Zero additional dependencies, simple mental model, easy to refactor to Zustand/Redux later if the app grows.

### Decision 2: Mock API Layer
**What:** Created `src/services/api.ts` — an abstraction that simulates REST API calls with artificial latency.

**Why:** 
1. Demonstrates understanding of async data flows
2. Makes the app trivially portable to a real backend (swap `api.ts` implementations)
3. Enables realistic loading states in the UI

**How:** Each function (`getTransactions`, `addTransaction`, `deleteTransaction`) wraps localStorage operations in a `Promise` with a `setTimeout` delay.

**Benefit:** The UI code never knows (or cares) whether data comes from localStorage or a real server — clean abstraction boundary.

### Decision 3: Design Token System
**What:** All colors defined as CSS custom properties in HSL format in `index.css`, referenced via Tailwind config.

**Why:** Enables dark mode with a single `.dark` class toggle. No color values are hardcoded in components — everything flows through semantic tokens like `--primary`, `--income`, `--expense`.

**How:**
```css
:root {
  --income: 152 60% 45%;
  --expense: 0 72% 55%;
}
.dark {
  --income: 152 55% 55%;
  --expense: 0 65% 60%;
}
```

**Benefit:** Theming is centralized. Changing the entire app's color scheme requires editing one file, not hundreds of components.

---

## 4. Component Breakdown

### SummaryCards
**What:** Three metric cards — Total Balance, Income, Expenses.

**Why:** Users need an immediate financial snapshot without scrolling or clicking.

**How:** Pulls aggregated data from context. Includes skeleton loaders during data fetch. Cards animate in with staggered `fade-in` keyframes.

**Benefit:** First thing the user sees = most important information. Loading skeletons prevent layout shift.

### BalanceTrend (Time-Based Visualization)
**What:** Area chart showing daily cumulative balance over time.

**Why:** Trends reveal more than static numbers. Users can spot income/expense patterns across weeks and months.

**How:** Transforms raw transactions into daily running balance using `reduce()`. Uses Recharts `AreaChart` with gradient fill. Tooltip shows exact date and balance.

**Benefit:** Visual storytelling — a rising trend feels reassuring, a dip triggers investigation.

### SpendingBreakdown (Categorical Visualization)
**What:** Pie/donut chart showing expense distribution by category.

**Why:** Answers the #1 user question: "Where does my money go?"

**How:** Aggregates expense transactions by category, calculates percentages. Custom color palette per category. Interactive legend.

**Benefit:** Instantly identifies the dominant spending category without reading a table.

### TransactionsTable
**What:** Full-featured data table with search, filtering, sorting, grouping, date ranges, and export.

**Why:** The dashboard summarizes; the table provides detail. Users need to drill into specific transactions.

**How:** 
- **Search:** Filters by description (case-insensitive)
- **Category/Type filters:** Dropdown selects
- **Date range:** From/To date inputs
- **Sorting:** Click column headers (date, amount, category)
- **Grouping:** Toggle "Group by Category" or "Group by Type" — shows subtotals
- **Export:** CSV and JSON download of current filtered view

**Benefit:** Power users get full control; casual users can simply scroll. Grouping reveals patterns the charts might miss.

### InsightsPanel
**What:** Automatically generated observations from the data.

**Why:** Not every user can read charts. Plain-language insights make data accessible.

**How:** Calculates:
- Highest spending category (with percentage of total)
- Month-over-month spending change
- Average transaction size
- Largest single transaction

**Benefit:** Actionable intelligence without requiring financial literacy.

### RoleToggle
**What:** Dropdown to switch between "Admin" and "Viewer" roles.

**Why:** Demonstrates role-based UI without backend auth complexity.

**How:** Stores role in context. Components conditionally render based on `role`:
- **Admin:** Can add transactions (dialog), delete transactions (button per row)
- **Viewer:** Read-only — add/delete controls are hidden

**Benefit:** Shows understanding of RBAC patterns. Clean conditional rendering, not messy `if` blocks.

### AddTransactionDialog
**What:** Modal form to create a new transaction.

**Why:** Admin users need to input data, not just view it.

**How:** Uses shadcn Dialog + form inputs. Validates required fields. Calls `api.addTransaction()` and updates context on success. Includes date picker, category select, type toggle.

**Benefit:** Contained in a dialog — doesn't disrupt the dashboard layout. Form is simple but complete.

### DarkModeToggle
**What:** Sun/Moon icon button to switch themes.

**Why:** Dark mode reduces eye strain, saves battery on OLED, and users expect it in 2024+.

**How:** Toggles `.dark` class on `<html>`. Persists preference to localStorage. Falls back to system preference (`prefers-color-scheme`).

**Benefit:** Respects user preference hierarchy: saved choice > system setting > light default.

---

## 5. State Management Strategy

### What state exists?
| State | Location | Why there? |
|-------|----------|------------|
| Transactions | Context | Shared across 5+ components |
| Filters (search, category, type, dates) | TransactionsTable (local) | Only used by the table |
| Role | Context | Affects multiple components |
| Theme (dark/light) | DarkModeToggle (local + localStorage) | Only needs DOM class + persistence |
| Loading | Context | Controls skeleton states globally |

### Why this split?
**Global state (Context)** for data shared across components. **Local state** for UI-specific concerns like filters and sort direction. This prevents unnecessary re-renders — changing a filter doesn't re-render the pie chart.

**Benefit:** Optimal performance without memoization complexity. Clear ownership of each piece of state.

---

## 6. Data Layer Design

### Mock Data Generation
**What:** `mockData.ts` generates ~120 realistic transactions spanning 6 months.

**Why:** Enough volume to make charts meaningful, varied enough to test edge cases.

**How:** 
- Categories: Salary, Freelance, Food & Dining, Transportation, Entertainment, Shopping, Bills & Utilities, Healthcare, Investments
- Each transaction has: id, date, description, amount, category, type
- Dates span the last 180 days with random distribution
- Amounts are realistic (salary: $3000-5000, coffee: $3-8, rent: $800-1500)

**Benefit:** Charts look realistic. Filtering and grouping produce meaningful results.

### LocalStorage Persistence
**What:** Transactions are saved to and loaded from localStorage via the mock API.

**Why:** Page refresh shouldn't wipe user-added transactions. Demonstrates data persistence without a server.

**How:** `api.getTransactions()` checks localStorage first, falls back to generated mock data. Mutations write back to localStorage.

**Benefit:** Feels like a real app. User modifications survive browser sessions.

---

## 7. UI/UX Design Decisions

### Layout Strategy
**What:** CSS Grid-based responsive layout.

**Why:** Grid handles the dashboard's mixed-size panels better than Flexbox alone.

**How:**
- Desktop: Multi-column grid — summary cards span full width, charts side by side, table full width
- Tablet: Charts stack vertically, table remains full width
- Mobile: Single column, everything stacks

**Benefit:** No horizontal scrolling on any device. Information hierarchy maintained across breakpoints.

### Color Palette
**What:** Neutral base with semantic accents — green for income, red for expenses, blue for primary actions.

**Why:** Financial data is inherently positive/negative. Color-coding makes scanning instant.

**How:** HSL-based CSS custom properties with dark mode variants. Green and red maintain meaning in both themes.

**Benefit:** Universal understanding. Users don't need a legend to know green = good, red = attention.

### Animation Strategy
**What:** Staggered fade-in on page load + subtle hover effects.

**Why:** Animations should guide attention, not distract. Cards appearing sequentially draws the eye top-to-bottom.

**How:** CSS `@keyframes` with `animation-delay` per card. Hover effects use `transform: scale()` with `transition`.

**Benefit:** Polished feel without performance overhead. Pure CSS — no animation library dependency.

### Empty State Handling
**What:** Graceful UI when no transactions match filters or data is loading.

**Why:** Empty tables and blank charts confuse users. They need to know "no data" ≠ "broken app."

**How:** Conditional rendering with helpful messages ("No transactions found. Try adjusting your filters."). Skeleton loaders during data fetch.

**Benefit:** Users always understand the current state of the application.

---

## 8. Feature Implementation Plan

### Phase 1: Foundation (Core)
1. ✅ Set up project structure and design tokens
2. ✅ Create mock data generator
3. ✅ Build FinanceContext provider
4. ✅ Implement SummaryCards
5. ✅ Build BalanceTrend chart
6. ✅ Build SpendingBreakdown chart

### Phase 2: Interactions (Core)
7. ✅ Implement TransactionsTable with search & filters
8. ✅ Add sorting by column
9. ✅ Build RoleToggle and role-based conditional rendering
10. ✅ Create AddTransactionDialog (admin only)
11. ✅ Build InsightsPanel

### Phase 3: Enhancements (Optional)
12. ✅ Dark mode with system preference detection
13. ✅ localStorage persistence via mock API layer
14. ✅ Mock API with simulated latency + loading states
15. ✅ CSS animations (fade-in, scale-in, stagger)
16. ✅ CSV and JSON export
17. ✅ Advanced filtering (date range) and grouping (category/type subtotals)

---

## 9. Optional Enhancements — Deep Dive

### Dark Mode
**How it works:** Single `.dark` class on `<html>` activates alternate CSS custom properties. Every component uses semantic tokens, so the entire UI transforms with zero component changes.

**Persistence:** localStorage stores the user's choice. On load, checks: saved preference → system preference → light default.

### Export (CSV/JSON)
**How it works:** Builds a data string from the current filtered/grouped view. Creates a `Blob`, generates an object URL, and triggers a download via a temporary `<a>` element.

**Why current filtered view?** Users expect to export what they see, not the entire dataset.

### Advanced Filtering
**Date range:** Two date inputs. Transactions outside the range are excluded before other filters apply.

**Grouping:** When enabled, transactions are organized under group headers (e.g., "Food & Dining — 15 transactions — $1,234.56 total"). Each group is collapsible.

**Why grouping matters:** It transforms a flat list into structured information, revealing patterns like "I spend more on Entertainment than Healthcare."

---

## 10. Testing & Quality

### Manual Testing Checklist
- [ ] Dashboard loads with summary cards, charts, and table
- [ ] Search filters transactions in real-time
- [ ] Category and type dropdowns filter correctly
- [ ] Date range filtering works
- [ ] Column sorting toggles ascending/descending
- [ ] Grouping organizes transactions with correct subtotals
- [ ] Role toggle hides/shows admin controls
- [ ] Add transaction creates and persists a new entry
- [ ] Delete transaction removes entry (admin only)
- [ ] Dark mode toggles correctly and persists
- [ ] CSV export downloads correct data
- [ ] JSON export downloads correct data
- [ ] Responsive layout works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Empty filter results show helpful message
- [ ] Page refresh preserves transactions (localStorage)

### Code Quality Measures
- TypeScript strict mode for type safety
- Semantic HTML elements (`<main>`, `<section>`, `<table>`)
- ARIA labels on interactive elements
- Consistent naming conventions (PascalCase components, camelCase functions)
- Single responsibility per component
- No hardcoded colors — all through design tokens

---

## 11. Summary

### What was built?
A complete, interactive finance dashboard with 8 custom components, a context-based state management system, mock API layer, dark mode, data persistence, export functionality, and responsive design.

### Why these decisions?
Every choice prioritized **clarity over cleverness**:
- Context over Redux → simpler for this scale
- CSS animations over Framer Motion → fewer dependencies
- Mock API over direct localStorage → cleaner abstraction
- Design tokens over hardcoded colors → maintainable theming

### Key benefits of this architecture:
1. **Portable** — Swap `api.ts` to connect to any real backend
2. **Themeable** — Change `index.css` tokens to rebrand entirely
3. **Extensible** — Add a new widget by creating one component + importing it
4. **Accessible** — Semantic HTML, keyboard navigation, screen reader labels
5. **Performant** — Local state where possible, minimal re-renders, CSS-only animations

### What I'd add with more time:
- Budget tracking with progress bars per category
- Recurring transaction detection
- Multi-currency support
- Drag-and-drop dashboard layout customization
- Real-time collaboration (WebSocket-based)
- End-to-end tests with Playwright

---

*This document serves as both a planning artifact and a technical reference for understanding the decisions behind FinDash.*
