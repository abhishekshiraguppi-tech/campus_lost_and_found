# 🎓 Campus Lost & Found Management System

A beginner-friendly, clean, functional, and modern full-stack web application designed for students and campus staff to report lost items, submit found items, browse campus listings, search/filter items by location or category, and contact item posters directly.

> **Note**: This application does **NOT** require any login, registration, user accounts, or complex database setups. All data is persisted locally in a simple JSON file with uploaded images stored in a local directory.

---

## 🌟 Key Features

- **🏠 Modern Campus Landing Page**: Features a hero banner, quick actions ("Report Lost", "Report Found", "Browse Items"), real-time statistics counters (Total Lost, Found, Reunited), a "How It Works" guide, and recent campus listings.
- **🚨 Report Lost Item Form**: Submit lost property with name, category, description, date, approximate location, contact information, additional details, and optional photo upload with validation.
- **📦 Report Found Item Form**: Submit items found across lecture halls, libraries, or dining halls so owners can quickly claim them.
- **🔍 Browse & Filter Listings**: View items as responsive cards with status badges (🔴 Lost, 🟢 Found, 💜 Reunited). Includes real-time keyword search, status filtering, category selection, and newest/oldest date sorting.
- **📖 Item Detail View & Modal**: Modal popups and dedicated routes (`/items/:id`) displaying complete item details, high-resolution photo viewer, reporter contact card with one-click copy to clipboard, and status updates.
- **🤝 Mark as Reunited**: Single-click action to update item status to **Reunited** when an item is safely returned to its owner.
- **📊 Analytics & Dashboard**: Overview of campus metrics (Total Reports, Active Lost/Found, Reunited count, Success Rate %), interactive visual progress bars by category, status distribution summaries, and recent activity logs.
- **💾 Persistent JSON Storage**: Automatic data initialization with seed data and auto-creation of storage directories (`server/data/` and `server/uploads/`).

---

## 🛠️ Recommended Tech Stack

### Frontend
- **React (v18)**: Component-based user interface.
- **Vite (v5)**: Fast development server and production bundler.
- **React Router (v6)**: Client-side routing (`/`, `/browse`, `/report-lost`, `/report-found`, `/dashboard`, `/items/:id`).
- **Custom Modern CSS**: Responsive layout, CSS variables, glassmorphism, campus colors, and smooth micro-animations.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: RESTful API server.
- **Multer**: Middleware for handling `multipart/form-data` and image uploads with file type (JPG, PNG, WEBP, GIF) and size limit (5MB) validation.

### Storage
- **JSON File Storage**: Persistent storage in `server/data/items.json`.
- **Local Uploads Directory**: Static image file storage in `server/uploads/`.

---

## 📁 Project Structure

```
campus-lost-found/
│
├── client/                     # Frontend React + Vite app
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
│   │   ├── services/           # API Client Service
│   │   │   └── api.js
│   │   ├── styles/             # Global Stylesheet & CSS Variables
│   │   │   └── index.css
│   │   ├── App.jsx             # React Router Setup
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Node.js + Express server
│   ├── data/
│   │   └── items.json          # Persistent JSON storage file (auto-generated)
│   ├── uploads/                # Directory for uploaded item images (auto-generated)
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
├── README.md                   # Project documentation
└── package.json                # Root package for running scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have **Node.js** (v16 or higher) and **npm** installed on your system.
Verify by running:
```bash
node -v
npm -v
```

---

### Step 1: Install Dependencies

You can install dependencies for both the backend server and frontend client.

#### Option A: Quick Command (from root folder)
```bash
npm run install:all
```

#### Option B: Manual Setup
Open two terminal windows or run sequentially:

**Backend Dependencies:**
```bash
cd server
npm install
```

**Frontend Dependencies:**
```bash
cd client
npm install
```

---

### Step 2: Start the Application

To run the application locally, you will start the **Backend Server** (Port 5000) and **Frontend Client** (Port 3000).

#### Terminal 1: Start Backend Server
```bash
cd server
npm start
```
*or for auto-reload development mode:*
```bash
cd server
npm run dev
```
> Server runs at `http://localhost:5000`

#### Terminal 2: Start Frontend Client
```bash
cd client
npm run dev
```
> Frontend runs at `http://localhost:3000`

Open your web browser and navigate to **`http://localhost:3000`** to view the application!

---

## 📡 REST API Documentation

The backend server exposes clean REST endpoints under `/api/items`.

| Method | Endpoint | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/items` | Retrieve all items | `search`, `status` (lost/found/reunited/all), `category`, `sort` (newest/oldest) |
| `GET` | `/api/items/stats` | Retrieve system analytics & summary counts | None |
| `GET` | `/api/items/:id` | Retrieve single item details by ID | None |
| `POST` | `/api/items` | Create new lost/found report (supports image upload) | `multipart/form-data` |
| `PUT` | `/api/items/:id` | Update item details or replace image | `multipart/form-data` |
| `PATCH` | `/api/items/:id/reunite` | Mark item status as **Reunited** | None |
| `DELETE` | `/api/items/:id` | Remove item listing | None |

### Sample JSON Item Structure
```json
{
  "id": "item_1727700000003",
  "name": "Brown Vintage Leather Backpack",
  "status": "Lost",
  "category": "Bags & Wallets",
  "description": "Dark brown vintage leather backpack containing Organic Chemistry notebook and dorm keys.",
  "date": "2026-09-30",
  "location": "Central Campus Library - 3rd Floor Quiet Area",
  "contactName": "Jordan Lee",
  "contactInfo": "jordan.l@campus.edu / (555) 234-5678",
  "additionalDetails": "Reward offered if returned intact with class notes!",
  "imageUrl": "/uploads/item-1727700000003.jpg",
  "createdAt": "2026-09-30T09:00:00.000Z"
}
```

---

## 💾 Data & Image Storage Explanation

- **Data File (`server/data/items.json`)**: When the backend server boots up for the first time, it checks if `data/items.json` exists. If not, it creates the folder and populates the file with initial seed items so the web page is never blank. Any create, update, or status change writes directly to this file, persisting across server restarts.
- **Uploads Folder (`server/uploads/`)**: Any images attached during submission are verified for file type (JPG, PNG, WEBP, GIF) and file size (< 5MB), renamed with a timestamp string to prevent name collisions, and saved in `server/uploads/`. The Express server serves these files publicly at `http://localhost:5000/uploads/filename`.

---

## 🖼️ Application Screenshots & UI Sections

1. **Home Page**: Includes campus header, quick statistics counter cards, workflow guide, and recent listings grid.
2. **Browse Items Page**: Interactive search bar with instant filter pills for Status, Category dropdown, Date sorting, and responsive card views.
3. **Report Lost / Report Found Forms**: Clean forms with client-side required field validation, file drag-and-drop preview, and submission confirmation messages.
4. **Item Detail View**: Modal & standalone view with high-res photo viewer, full description, reporter contact box, and one-click "Mark as Reunited" resolution.
5. **Dashboard Analytics**: System metrics, success rate percentage, category distribution progress bars, and recent activity timeline.

---

## 🔮 Future Improvements

If expanding this project for a higher-level course or capstone project, potential enhancements include:
- **Campus Map Integration**: Interactive SVG or Leaflet map allowing students to pin exact lost/found locations on a campus map.
- **Email Notifications**: Integration with Nodemailer to send automated notifications when a matching item category is reported.
- **QR Code Generation**: Generate printable QR code posters for lost items to hang on campus bulletin boards.

---

## 📄 License & Academic Note

This project is created as an open, educational Full-Stack Software Engineering project for college students. Free to use, adapt, and demonstrate!
