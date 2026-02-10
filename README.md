# 🔥 Resume Rejection Analyzer MVP

**Tagline:** "Why recruiters silently reject you in 6 seconds."

A brutally honest, single-page resume analyzer that shows users the exact reasons why recruiters reject their resumes. No fluff, no motivation—just cold, hard truth.

## 🎯 What It Does

1. User pastes their resume or LinkedIn bio
2. AI analyzes it like a senior recruiter (15+ years experience, 300+ resumes/day)
3. Returns:
   - **Rejection Score** (0-100)
   - **Top 3 Rejection Reasons** (blunt and specific)
   - **The Line That Kills Your Chances** (exact quote from resume)
   - **Locked Fix Section** (paywall for ₹199 - currently just a mockup)

## 🛠️ Tech Stack

- **Frontend:** HTML + Tailwind CSS (via CDN) + Vanilla JavaScript
- **Backend:** Node.js + Express
- **AI:** **Google Gemini API (FREE!)** ✅
- **Payments:** Not implemented in MVP (fake paywall for now)

## 📋 Prerequisites

Before running this project, make sure you have:

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **Google Gemini API Key** (100% FREE!)
   - Get one at [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **No credit card required**
   - **1,500 free requests per day**
   - **Estimated cost: $0.00** (completely free!)

## 🚀 Installation & Setup

### 1. Clone or Download This Project

```bash
cd "c:\Users\Tarunjit\Documents\MVP - why u rejected"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```bash
cp .env.example .env
```

Edit `.env` and add your **FREE Gemini API key**:

```
GEMINI_API_KEY=AIzaSyB_your_actual_key_here
PORT=3000
NODE_ENV=development
```

**🔑 How to get your FREE API key:**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google (no credit card needed!)
3. Click "Create API Key"
4. Copy and paste into the `.env` file above

**Full guide:** See [GEMINI_API_SETUP.md](file:///c:/Users/Tarunjit/Documents/MVP%20-%20why%20u%20rejected/GEMINI_API_SETUP.md) for detailed screenshots and steps.

### 4. Start the Backend Server

```bash
npm run dev
```

You should see:
```
🔥 Resume Rejection Analyzer API running on port 3000
📍 API endpoint: http://localhost:3000/analyze
🤖 Using: Google Gemini AI (FREE)
```

### 5. Open the Frontend

Simply open `frontend/index.html` in your browser:

```bash
cd ../frontend
# Double-click index.html OR use a local server
```

**For better CORS handling, use a local server:**

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js http-server (install globally first)
npx http-server -p 8000
```

Then visit: `http://localhost:8000`

## 🧪 Testing the MVP

### Test with Sample Resume

Paste this into the textarea:

```
Experienced Software Developer with 3+ years in web development.

Skills: JavaScript, React, Node.js, Python, MongoDB, Git

Projects:
- Built a todo app using React and Node.js
- Developed multiple projects using modern technologies
- Worked on various full-stack applications

Experience:
Software Developer at TechCorp
- Worked on multiple projects
- Collaborated with team members
- Improved code quality
```

Expected output:
- Low rejection score (20-40)
- Brutal feedback on generic language
- Specific callouts on weak project descriptions

### Test API Directly (Optional)

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Sample resume text here..."
  }'
```

## 📁 Project Structure

```
MVP - why u rejected/
├── frontend/
│   └── index.html          # Single-page app (all-in-one)
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json        # Dependencies
│   ├── .env.example        # Environment template
│   └── .env                # Your actual config (don't commit!)
└── README.md               # This file
```

## 🎨 Design Philosophy

- **Dark & Clinical:** Black background, red accents, uncomfortable tone
- **Zero Fluff:** No motivational language, no encouragement
- **Brutal Honesty:** Direct feedback that makes users uncomfortable
- **Single Focus:** One input, one output, one action

## 🔒 Paywall (Phase 2)

Currently, the "Fix My Resume" section is just a blurred mockup.

To implement payments:
1. Integrate **Razorpay** (India) or **Stripe** (Global)
2. Create a backend route for payment processing
3. Store user email + payment status
4. Generate and send the "fixed" resume via email

## 📦 Dependencies Installed

All backend dependencies were successfully installed:

```json
{
  "express": "^4.18.2",
  "dotenv": "^16.4.1",
  "cors": "^2.8.5",
  "@google/generative-ai": "^0.21.0"
}
```

## 💰 Cost Tracking

**COMPLETELY FREE!** 🎉

Google Gemini free tier:
- **Per analysis**: $0.00
- **Daily limit**: 1,500 requests
- **Monthly cost**: $0.00
- **Credit card required**: No ❌

This means you can:
- Run **1,500 analyses per day** for free
- Test with unlimited users (within daily limits)
- **Zero operating costs** for MVP phase

**When to upgrade:**
- If you need more than 1,500 requests/day
- Gemini paid tiers are also very cheap (~10x cheaper than OpenAI)

## 🚨 Important Notes

1. **API Key Security:** Never commit your `.env` file to Git
2. **Rate Limiting:** Consider adding rate limits in production
3. **CORS:** Frontend must be served from same origin or configure CORS properly
4. **Error Handling:** API errors are logged but sanitized for users

## 🐛 Troubleshooting

### "Invalid Gemini API key"
- Verify your API key at https://makersuite.google.com/app/apikey
- Make sure you copied the entire key (starts with `AIzaSy...`)
- Check there are no extra spaces in your `.env` file
- Restart the server after adding the key

### "API quota exceeded"
- Free tier limit is 1,500 requests/day
- Wait until the next day (resets at midnight UTC)
- Or upgrade to paid tier for higher limits

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check CORS is enabled (it is by default)
- Verify API_URL in `index.html` points to `http://localhost:3000/analyze`

### Score/reasons not parsing correctly
- Check Gemini response in backend logs
- The parser has fallbacks, but Gemini should follow format consistently
- Try the analysis again (AI responses can vary slightly)

## 🎯 Next Steps (Post-MVP)

1. Add authentication (optional)
2. Implement real payment gateway
3. Create "fix" generation logic
4. Add database to store analyses
5. Deploy to production (Vercel, Railway, etc.)
6. Add analytics to track conversion rates

## 📝 License

This is an MVP. Do whatever you want with it.

---

**Built with brutal honesty in mind. No sugar-coating. Just truth.**
