# 🎯 Smart Attendance System – Frontend

A modern frontend for the Smart Attendance System built with React + TypeScript.
Provides dashboards for **students and teachers with real-time interaction**.

---

## ✨ Features

* 🔐 Authentication (Login/Register)
* 👨‍🏫 Teacher Dashboard
* 👨‍🎓 Student Dashboard
* 📷 QR Scanner for attendance
* 🔔 Real-time attendance updates
* 📱 Mobile responsiveness improvements
* 🎥 Camera optimization for QR scanning
* 🌐 Deployment (Vercel/Netlify)
* 📊 Session & Batch management UI
* ⚡ Fast UI with reusable components
* 🎨 Clean and responsive design

---

## 🛠️ Tech Stack

* React
* TypeScript
* Vite
* Axios
* Context API

---

## 📁 Project Structure

```
smart-kalahandi/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── CollegeBranding.tsx
│   │   ├── FullScreenLoader.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── NavLink.tsx
│   │   ├── TeacherLayout.tsx
│   │   └── TeacherSidebar.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/
│   ├── lib/
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── student/
│   │   │   ├── Dashboard.tsx
│   │   │   └── Scanner.tsx
│   │   │
│   │   ├── teacher/
│   │   │   ├── Batches.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── QRSession.tsx
│   │   │   ├── Semesters.tsx
│   │   │   ├── SessionRoom.tsx
│   │   │   ├── Sessions.tsx
│   │   │   └── Subjects.tsx
│   │   │
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.js
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/smart-kalahandi.git
cd smart-kalahandi
npm install
```

---

## 🔑 Environment Variables

Create `.env`:

```
VITE_BACKEND_URL=http://localhost:5000
```

---

## ▶️ Run App

```bash
npm run dev
```

---

## 🔗 Backend Connection

Make sure backend is running at:

```
http://localhost:5000
```

## 👨‍💻 Author

**Balram Naik**

---
