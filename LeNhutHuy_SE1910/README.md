# FUNewsManagementSystem - Assignment 01

**Course:** SBA301 – Integrate Single Page Application with Spring Boot  
**Student Name:** Lê Nhựt Huy  
**Student ID:** CE200376  
**Class Code:** SE1910  
**Project Name:** `LeNhutHuy_SE1910` (`lenhuthuy_se1910`)

---

## 1. Project Overview

FUNewsManagementSystem is a single page application (SPA) built using ReactJS and Vite. It serves as an administrative management portal for managing news articles, categories, and user accounts.

### Tech Stack:
- **Framework:** React 18 + Vite 5
- **Styling:** Vanilla CSS (Custom Design System in `src/index.css`)
- **State Management & Persistence:** React Hooks (`useState`, `useEffect`) + `localStorage`
- **Data Layer:** Mock data service with seed values in `src/data/initialData.js`

---

## 2. Setup and Execution Instructions

### Prerequisites:
- Node.js (v18+ or v20+)
- npm (v9+ or v10+)

### Steps to Run:
```bash
# 1. Navigate to the project directory
cd LeNhutHuy_SE1910

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173/
```

### Production Build:
```bash
npm run build
```

---

## 3. Test Credentials

| Username | Password | Role | Description |
|---|---|---|---|
| `Admin` | `Admin` | Administrator (Role 1) | Full access to all management modules |
| `john_staff` | `123` | Staff (Role 2) | Staff account |
| `mary_editor` | `123` | Staff (Role 2) | Staff editor account |

---

## 4. Architecture and Component Structure

```
src/
├── assets/
│   └── logo.png                  # AI-generated system logo
├── components/
│   ├── common/
│   │   ├── Modal.jsx             # Reusable popup dialog for Create/Update
│   │   └── ConfirmDialog.jsx     # Reusable confirmation dialog for Delete
│   └── layout/
│       ├── Header.jsx            # Header with logo, title, user badge, and logout
│       ├── Sidebar.jsx           # Sidebar menu navigation (5 sections)
│       └── AdminLayout.jsx       # Master admin layout
├── data/
│   └── initialData.js            # Seed data and localStorage utilities
├── pages/
│   ├── LoginPage.jsx             # Login with validation and credential checking
│   ├── DashboardPage.jsx         # Summary metrics and recent articles
│   ├── CategoryManagement.jsx    # Category CRUD + Search
│   ├── NewsManagement.jsx        # News CRUD + Search + Category relation
│   ├── UserManagement.jsx        # User CRUD + Search + Role mapping
│   └── SettingsPage.jsx          # Profile details and reset data option
├── App.jsx                       # Root state, auth session, and menu routing
├── index.css                     # Global design styles and layout
└── main.jsx                      # React DOM entry point
```

---

## 5. Requirement Traceability Matrix (RTM)

| ID | Requirement | Implementation Evidence | Verification Status |
|---|---|---|---|
| **R01** | ReactJS + Vite, naming convention | `package.json`, folder `LeNhutHuy_SE1910` | Pass (`npm run dev`) |
| **R02** | Login page with validations | `LoginPage.jsx` (empty and wrong credential checks) | Pass |
| **R03** | Admin/Admin authentication | `handleLogin` updates state and transitions to admin layout | Pass |
| **R04** | Logo asset created with AI | `src/assets/logo.png` displayed in Header and Login | Pass |
| **R05** | Header + Master layout | `AdminLayout.jsx` & `Header.jsx` wrap all pages | Pass |
| **R06** | 5 Menu Sections | Sidebar contains Dashboard, Category, News, Users, Settings | Pass |
| **R07** | Category CRUD + Search | `CategoryManagement.jsx` with modal and delete confirmation | Pass |
| **R08** | News CRUD + Search | `NewsManagement.jsx` with Category relation and validation | Pass |
| **R09** | User CRUD + Search | `UserManagement.jsx` with Role 1 (Admin) & Role 2 (Staff) | Pass |
| **R10** | Create/Update via popup dialog | `Modal.jsx` handles create and update flows with prefill | Pass |
| **R11** | Delete confirmation dialog | `ConfirmDialog.jsx` protects destructive actions | Pass |
| **R12** | Data model and persistence | Seed data in `initialData.js` synced with `localStorage` | Pass |

---

## 6. Test Matrix

| # | Group | Test Case | Action / Steps | Expected Result | Status |
|---|---|---|---|---|---|
| 1 | Login | Empty | Click Sign In with blank fields | Shows validation message; no login | Pass |
| 2 | Login | Wrong credential | Enter invalid username/password | Displays "Invalid username or password" | Pass |
| 3 | Login | Valid Admin | Enter Admin / Admin | Logs in and redirects to Dashboard | Pass |
| 4 | Auth | Logout | Click Logout button in Header | Clears session, returns to Login page | Pass |
| 5 | Layout | Menu completeness | Inspect Sidebar | Exactly 5 items: Dashboard, Category, News, Users, Settings | Pass |
| 6 | Navigation | All menus | Click each menu item | Changes active view smoothly without full reload | Pass |
| 7 | Category | Read | Open Category page | Displays table with ID, Name, Status | Pass |
| 8 | Category | Create valid | Open Add dialog, fill name, submit | New record added to list; modal closes | Pass |
| 9 | Category | Create invalid | Leave name empty, submit | Shows "Category name is required" | Pass |
| 10 | Category | Update | Click Edit, modify name, save | Record updated with new name | Pass |
| 11 | Category | Delete cancel | Click Delete, then click Cancel | Record remains intact | Pass |
| 12 | Category | Delete confirm | Click Delete, then click Delete | Record is deleted from list | Pass |
| 13 | Category | Search hit | Type existing category name | List filters to matching records | Pass |
| 14 | Category | Search miss | Type non-existent keyword | Displays "No categories found" | Pass |
| 15 | News | Read | Open News page | Displays table with Category names | Pass |
| 16 | News | Create valid | Add article with category and content | New article added; modal closes | Pass |
| 17 | News | Create invalid | Submit with empty title/content | Shows validation error | Pass |
| 18 | News | Update | Edit article title and category | Article updated accurately | Pass |
| 19 | News | Delete cancel | Click Delete, then Cancel | Article remains intact | Pass |
| 20 | News | Delete confirm | Click Delete, then Confirm | Article deleted from list | Pass |
| 21 | News | Search hit | Search existing article title | Filtered list displayed | Pass |
| 22 | News | Search miss | Search non-existent keyword | Displays "No news articles found" | Pass |
| 23 | Users | Read | Open Users page | Displays table with Role & Status badges | Pass |
| 24 | Users | Create valid | Add new user with role and status | User added to table | Pass |
| 25 | Users | Create invalid | Empty field or duplicate username | Shows validation error | Pass |
| 26 | Users | Update | Edit user role or status | User record updated | Pass |
| 27 | Users | Delete cancel | Click Delete, then Cancel | User remains intact | Pass |
| 28 | Users | Delete confirm | Click Delete, then Confirm | User deleted from list | Pass |
| 29 | Users | Search hit | Search by username | Matching users displayed | Pass |
| 30 | Users | Search miss | Search non-existent username | Displays "No users found" | Pass |
| 31 | News | Relation | Check news category dropdown | Category options match existing categories | Pass |
| 32 | User | Role mapping | Inspect role display | Role 1 mapped to Admin, Role 2 to Staff | Pass |
| 33 | Status | Status display | Inspect status display | 1 displays Active badge, 0 displays Inactive | Pass |
| 34 | Data | Empty state | Filter with no results or empty list | UI displays friendly empty message | Pass |
| 35 | Persistence | Reload | Refresh browser (F5) | Session and CRUD changes persist via localStorage | Pass |

---

## 7. Solution Design & State Architecture

### 7.1 State Ownership Map (Guide Section 3.2)

| State Category | Examples | Location | Rationale |
|---|---|---|---|
| **Local UI State** | `isModalOpen`, `modalMode`, `formError`, `relationError` | In each management page component (`CategoryManagement`, `NewsManagement`, `UserManagement`) | Isolated UI feedback; does not need to be shared globally. |
| **Form State** | `formData` (`name`, `title`, `content`, `categoryId`, `username`, etc.) | Local inside management page component | Bound directly to form lifecycle; resets upon dialog open/close. |
| **Selected Item** | `selectedCategory`, `selectedArticle`, `selectedUser`, `deleteTarget` | Management page component | Holds reference of entity undergoing update or deletion confirmation. |
| **Shared Data** | `categories`, `news`, `users` | Lifted up to `App.jsx` root | Multiple components read and update these entities (e.g. Dashboard aggregates all entities, News reads Categories). |
| **Auth State** | `currentUser` | `App.jsx` + `localStorage` (`funews_auth`) | Controls route access, renders Login vs AdminLayout, and provides author context for news creation. |
| **Persistent State** | `funews_categories`, `funews_news`, `funews_users` | `localStorage` synchronized via `useEffect` | Retains all CRUD modifications across browser page refreshes. |

### 7.2 Design Decision Record - DDR (Guide Section 3.6)

| # | Decision Topic | Chosen Solution | Rationale / Trade-offs | Impact if Requirements Change |
|---|---|---|---|---|
| 1 | **Navigation** | State-driven conditional rendering (`activeMenu` in `App.jsx`) | Lightweight, zero routing dependencies, perfect for single-page assignment requirements. | If deep-linking or browser back/forward history is needed, migrate to `react-router-dom`. |
| 2 | **State Ownership** | Lifted shared data to `App.jsx`, localized form/modal state | Ensures Dashboard and News always have access to up-to-date Category and User collections. | If the app scales, wrap with React Context or Redux/Zustand without changing leaf UI components. |
| 3 | **Mock Persistence** | `localStorage` with lazy initializer `useState(() => getStoredData(...))` | Guarantees instant synchronous hydration on load without flash of empty content; persists modifications. | In Phase 2, swap `localStorage` calls with `fetch`/`axios` calls to the Spring Boot REST API. |
| 4 | **CRUD Dialog Reuse** | Single reusable `Modal.jsx` and `ConfirmDialog.jsx` with `modalMode` | Eliminates duplicated markup for create and update dialogs while keeping dialog logic DRY. | Easily extendable with custom form layouts or multi-step wizards. |
| 5 | **Search Strategy** | Non-destructive client-side filtering (`normalizedSearch`) | Source list remains untouched in state; searches are case-insensitive and whitespace-trimmed. | Can switch to debounced server-side query parameters when integrating with Spring Boot. |
| 6 | **Referential Integrity** | Restrict Category deletion if active News articles reference it | Prevents orphaned records in news articles; answers the teacher's key interview question. | If CASCADE policy is requested, update `setNews` to remove or reassign orphaned articles automatically. |

---

## 8. Debugging & Problem Solving (Guide Section 6.3)

| # | Bug / Issue Description | Initial Hypothesis | Verification Method | Root Cause | Fix Applied | Retest Result |
|---|---|---|---|---|---|---|
| 1 | Deleting a category resulted in orphaned news articles showing "Unknown" category. | Category was deleted without checking active relationships. | Create article under "Campus Life", delete "Campus Life", check News table. | Category deletion had no referential check against the `news` array. | Added `news.filter(n => n.categoryId === category.id)` check. If linked articles exist, display warning alert and block deletion. | Pass. Alert displays cleanly and category remains protected. |
| 2 | Submitting news article creation when no categories exist caused invalid `categoryId`. | Form submitted with fallback ID `1` which didn't exist in empty category list. | Clear all categories, attempt to create article. | Missing validation for empty category array and foreign key existence. | Added check `if (categories.length === 0 || !categoryExists) setFormError(...)`. | Pass. Error message displayed; article creation safely aborted. |
| 3 | Searching caused runtime crash if an entity's text field was undefined or null. | `.toLowerCase()` was invoked directly on potentially undefined fields. | Pass an article with missing content into search filter. | Unsafe string invocation without fallback string. | Wrapped all searched fields with safe fallback: `(field \|\| "").toLowerCase()`. | Pass. Search runs smoothly without any console or runtime exceptions. |

---

## 9. Controlled AI Usage Log (Guide Section 9.4)

| # | Prompt / Request | Purpose | AI Suggestion | Verification Method | Adjustments Made |
|---|---|---|---|---|---|
| 1 | "Generate a modern SVG/PNG logo for a university news portal named FUNewsManagementSystem" | Create required AI logo asset for Header and Login branding (R04). | Generated high-resolution modern blue crest emblem. | Verified image loads in browser and scales smoothly in Header (36px) and Login (72px). | Placed in `src/assets/logo.png` and `public/logo.png`. |
| 2 | "Recommend design tokens and CSS variables for an admin portal with dark sidebar and clean card tables." | Create cohesive CSS design system without external CSS frameworks. | Provided CSS custom properties for palette, shadows, badges, and responsive sidebar. | Inspected styling across various screen widths (mobile vs desktop breakpoint at 768px). | Fine-tuned button hover transitions, alert borders, and modal backdrop blur. |
| 3 | "Help identify edge cases when deleting categories with associated news records." | Verify data integrity requirement from Assignment Guide Step 9. | Suggested either CASCADE or RESTRICT policy. | Evaluated rubric requirement for "relation trở nên invalid". | Implemented RESTRICT policy with friendly warning banner in Category Management. |

---

## 10. Oral Defense & Code Walkthrough (Guide Section 7 & 12)

### 10.1 5-Layer Code Explanation Framework (Guide Section 7.1)
- **1. Purpose:** What responsibility does this component solve? (e.g., `CategoryManagement` handles viewing, adding, updating, searching, and deleting categories with referential integrity).
- **2. Input:** What props or states flow in? (Receives `categories`, `setCategories`, and `news` array from `App.jsx`).
- **3. Trigger:** What triggers state changes? (`onSubmit` for form submission, `onChange` for controlled inputs, `onClick` for action buttons).
- **4. Transform:** How is data transformed? (Validates required fields, generates immutable updates with `[...prev, newItem]` or `map()`, trims and normalizes search terms).
- **5. Output:** What does React re-render? (State updates trigger re-render of displayed tables and status badges, with automatic synchronization to `localStorage`).

### 10.2 30-Second Rapid Code Navigation Checklist (Guide Section 7.3)
- **Login Condition (`Admin/Admin`):** Open `src/pages/LoginPage.jsx` &rarr; Lines 19–27.
- **Auth Session & Logout:** Open `src/App.jsx` &rarr; Lines 18–20 (`useState`), Lines 49–57 (`handleLogin`, `handleLogout`).
- **Category Create/Update Modal Logic:** Open `src/pages/CategoryManagement.jsx` &rarr; Lines 43–67 (`handleFormSubmit`).
- **News Category Relation:** Open `src/pages/NewsManagement.jsx` &rarr; Lines 23–26 (`getCategoryName`), Lines 82–86 (`categoryExists` validation).
- **User Role & Delete Protection:** Open `src/pages/UserManagement.jsx` &rarr; Lines 196–203 (Role badges), Lines 222–234 (Self-delete prevention).
- **Search Non-Destructive Flow:** Any management page &rarr; Filter applied on `displayedX` derived array; source state is never mutated.

---

## 11. Scope and Limitations (Guide Section 1.3)

- **Backend:** In strict compliance with the assignment guide (Section 1.3), no Spring Boot backend or external database is required for Assignment 01. All data operations are handled client-side using mock data services with `localStorage` persistence.
- **Authentication:** Mock authentication supporting Admin (`Admin`/`Admin`) and configured staff accounts.
- **Code Cleanliness:** All code is written cleanly following React best practices with immutable state updates, strict component separation, controlled inputs, and zero console errors.
