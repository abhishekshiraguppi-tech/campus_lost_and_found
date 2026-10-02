# 🎓 Campus Lost & Found Management System

A beginner-friendly, clean, functional, and modern full-stack web application designed for university students and campus staff to report lost property, turn in found items, search campus listings by location or category, and reunite items with their owners.

> **Note**: This application does **NOT** require any login, registration, user accounts, or complex database setups. All data is persisted locally in a simple JSON file with uploaded photos stored in a local directory.

---

## 🏛️ System Architecture & Data Flow

The application follows a **Decoupled Client-Server REST Architecture**:

```
+--------------------------------+           HTTP / REST API            +----------------------------------+
|   React + Vite Frontend        | <==================================> |   Node.js + Express Backend      |
|   (Port 3000)                  |   JSON Data / Multipart Uploads      |   (Port 5000)                    |
+--------------------------------+                                      +----------------------------------+
                                                                                         |
                                                                        +----------------+----------------+
                                                                        |                                 |
                                                                        v                                 v
                                                              +-------------------+             +--------------------+
                                                              | server/data/      |             | server/uploads/    |
                                                              | items.json        |             | (Item Photos)      |
                                                              +-------------------+             +--------------------+
```

### 🔄 End-to-End Data Flow Example

1. **Reporting Property**:
   - A student fills out the report form at `/report-lost` or `/report-found`.
   - The React client sends a `POST` request with `multipart/form-data` to `http://localhost:5000/api/items`.
   - Express validates input fields, saves any attached photo to `server/uploads/`, appends the new record to `server/data/items.json`, and returns a `201 Created` response.

2. **Searching & Filtering**:
   - When a user types in the search bar or selects filter pills (e.g. status `Lost`, category `Electronics`), React calls `GET /api/items?search=calculator&status=lost`.
   - The controller reads `items.json`, applies search & filter criteria, and returns matching items instantly.

3. **Reuniting Items**:
   - When an owner claims an item, a student clicks **"✓ Mark as Reunited"**.
   - The client sends `PATCH /api/items/:id/reunite`.
   - Express updates the item status to `Reunited`, saves the record, and the UI updates in real time.

---

## 🌟 Pages & Key Features

### 🏠 1. Home Page (`/`)
- **Campus Hero Banner**: Highlighting the platform purpose with quick action buttons (*Report Lost*, *Report Found*, *Browse Items*).
- **Live Counters**: Displays active metrics for *Total Lost*, *Total Found*, *Items Reunited*, and *Total Reports*.
- **"How It Works" Guide**: Step-by-step walkthrough explaining how students post, search, and reunite items.
- **Recent Listings**: Grid of the 4 newest reports with item photos, badges, dates, and quick view buttons.

### 🚨 2. Report Lost & 📦 Report Found (`/report-lost` & `/report-found`)
- Reusable form component with real-time field validation for:
  - Item Name *(Required)*
  - Category *(Electronics, Keys & Cards, Bags & Wallets, Clothing, Books, etc.)*
  - Date Lost / Found *(Required)*
  - Approximate Location *(e.g., "Library 3rd Floor" or "Science Building Rm 204")*
  - Detailed Description & Additional Instructions
  - Contact Name & Phone / Email
  - **Photo Upload**: Client & server validation for file type (JPG, PNG, WEBP, GIF) and 5MB max file size.
- Auto-generates unique IDs, timestamps entries, sets status to `Lost` or `Found`, and saves to persistent storage.

### 🔍 3. Browse Items Page (`/browse`)
- Displays all reported items in responsive card grids.
- **Real-Time Search**: Instant search matching item names, descriptions, locations, and categories.
- **Filter Tabs**: Filter by `All`, `Lost`, `Found`, or `Reunited`.
- **Category & Sort**: Select categories and sort listings by newest or oldest report date.
- **Empty State**: Clear messaging and reset options when no items match filters.

### 📖 4. Item Detail View (`/items/:id` & Modal Popup)
- Full item detail viewer with photo preview, location tag, reporter contact card, and a **"📋 Copy Contact Info"** button.
- **"✓ Mark as Reunited" Button**: Allows single-click resolution of item status.

### 📊 5. Dashboard Analytics (`/dashboard`)
- Metrics grid (*Total Reports, Active Lost, Active Found, Reunited, Success Rate %*).
- **Category Distribution**: Visual progress bar charts showing item breakdown by category.
- **Status Summary**: Proportion bars comparing Lost vs. Found vs. Reunited items.
- **Recent Activity Table**: Log of recent campus reports with quick view links.

---

## 🛠️ Recommended Tech Stack

### Frontend
- **React (v18)**: Component-driven user interface.
- **Vite (v5)**: Lightning-fast development server & bundler.
- **React Router (v6)**: Client-side routing (`/`, `/browse`, `/report-lost`, `/report-found`, `/dashboard`, `/items/:id`).
- **Custom CSS**: Responsive layout, CSS variables, campus colors, and hover micro-animations.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: RESTful API framework.
- **Multer**: Middleware for `multipart/form-data` file uploads with size and format validation.

### Storage
- **JSON File Storage**: Persistent data file at `server/data/items.json`.
- **Local Uploads Directory**: Static image file storage at `server/uploads/`.

---

## 📁 Project Structure

```
campus-lost-found/
│
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemDetailModal.jsx
│   │   │   ├── ItemForm.jsx
│   │   │   └── NotificationBanner.jsx
│   │   ├── pages/              # Page Views
│   │   │   ├── HomePage.jsx
│   │   │   ├── BrowsePage.jsx
│   │   │   ├── ReportLostPage.jsx
│   │   │   ├── ReportFoundPage.jsx
│   │   │   ├── ItemDetailPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/           # API Client Service (Fetch wrapper)
│   │   │   └── api.js
│   │   ├── styles/             # Global Stylesheet & CSS Variables
│   │   │   └── index.css
│   │   ├── App.jsx             # React Router navigation setup
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Node.js + Express server
│   ├── data/
│   │   └── items.json          # Persistent JSON storage file (auto-generated)
│   ├── uploads/                # Directory for uploaded item photos (auto-generated)
│   ├── controllers/
│   │   └── itemsController.js  # CRUD & Filter logic
│   ├── middleware/
│   │   ├── upload.js           # Multer configuration
│   │   └── validate.js         # Input validation middleware
│   ├── routes/
│   │   └── itemsRoutes.js      # Express API routes
│   ├── server.js               # Main Express app entry point
│   └── package.json
│
├── README.md                   # Comprehensive project documentation
└── package.json                # Root package for running helper scripts
```

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
# Backend Dependencies
cd server
npm install

# Frontend Dependencies
cd client
npm install
```

### Step 2: Start the Application

Open two terminal windows:

**Terminal 1 (Backend Server - Port 5000):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend Client - Port 3000):**
```bash
cd client
npm run dev
```

Visit **`http://localhost:3000`** in your browser!

---

## 📡 REST API Reference

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Retrieve all items | `search`, `status` (lost/found/reunited/all), `category`, `sort` (newest/oldest) |
| `GET` | `/api/items/stats` | Retrieve system analytics & summary counts | None |
| `GET` | `/api/items/:id` | Retrieve single item details by ID | None |
| `POST` | `/api/items` | Create new lost/found report | `multipart/form-data` |
| `PUT` | `/api/items/:id` | Update item details or image | `multipart/form-data` |
| `PATCH` | `/api/items/:id/reunite` | Mark item status as **Reunited** | None |
| `DELETE` | `/api/items/:id` | Delete item listing | None |

---

## 📄 License & Student Note

This open-source project is created as a Full-Stack Software Engineering project for college students. Free to use, demonstrate, and customize!
