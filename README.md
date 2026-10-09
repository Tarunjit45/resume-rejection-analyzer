# 🎯 Resume Rejection Analyzer — AI ATS Audit & Diagnosis Engine

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Express](https://img.shields.io/badge/Backend-Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![UPI Payments](https://img.shields.io/badge/Payments-UPI%20QR%20Integration-00C853?style=for-the-badge)](UPI_QR_SETUP.md)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

An intelligent career diagnostic platform that reveals **why your resume is getting rejected by automated Applicant Tracking Systems (ATS)**. Powered by Google Gemini AI, it pinpoints missing keywords, flags unparseable layout formatting, calculates rejection probabilities, and includes a built-in **UPI QR micro-payment paywall** for premium deep-dive audits.

---

## ✨ Features

* 🤖 **Deep AI Rejection Diagnosis:** Ingests PDF/Word resumes and runs multi-factor heuristic audits using Google Gemini.
* 📊 **ATS Pass/Fail Probability:** Real-time scoring index predicting chances of clearing initial corporate recruiter filters.
* 💳 **UPI QR Payment System:** Integrated dynamic UPI payment modal (`UPI_QR_SETUP.md`, `premium-payment-modal.html`) for monetization.
* 🧪 **Zero-API Mock Mode:** Pre-configured mock testing server (`MOCK_MODE.md`, `server-mock.js`) for local debugging without incurring API costs.
* 🛠️ **Admin Management Console:** Dedicated administration portal (`admin/`) for auditing submissions and transactions.

---

## 📁 Repository Structure

```text
resume-rejection-analyzer/
├── backend/
│   ├── index.js                  # Production Express API server
│   ├── server-mock.js            # Offline mock server for development
│   └── routes/                   # Analyze, Payment, and Admin routes
├── public/                       # Frontend web dashboard & resume dropzone
├── admin/                        # Administrative telemetry dashboard
├── premium-payment-modal.html    # Dynamic UPI QR modal interface
├── GEMINI_API_SETUP.md           # Gemini API key setup instructions
├── UPI_QR_SETUP.md               # Indian UPI payment configuration guide
├── MOCK_MODE.md                  # Offline development documentation
├── package.json                  # Dependencies & scripts
├── LICENSE                       # MIT License
└── README.md
```

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/Tarunjit45/resume-rejection-analyzer.git
cd resume-rejection-analyzer

npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
UPI_ID=your_upi_id@bank
```

### 3. Launch Server
```bash
# Production server with Gemini AI
npm start

# Or offline mock server
npm run mock
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
