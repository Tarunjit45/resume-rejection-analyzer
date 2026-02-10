# How to Get Your FREE Google Gemini API Key

**Takes only 2 minutes. No credit card required!** ✅

## Step-by-Step Guide

### Step 1: Visit Google AI Studio

Go to: **https://makersuite.google.com/app/apikey**

(Or search for "Google AI Studio API Key")

### Step 2: Sign In

- Sign in with your **Google account**
- If you don't have one, create a free Google account first

### Step 3: Create API Key

1. Click on **"Create API Key"** button
2. Select **"Create API key in new project"** (recommended)
   - OR select an existing Google Cloud project if you have one
3. The API key will be generated instantly!

### Step 4: Copy Your API Key

- Click the **copy icon** to copy your API key
- It will look something like: `AIzaSyB...` (39 characters)

### Step 5: Add to Your .env File

1. Open the file: `backend/.env`
2. Replace `your_gemini_api_key_here` with your actual API key:

```
GEMINI_API_KEY=AIzaSyB_your_actual_key_here
```

3. Save the file

### Step 6: Restart the Server

If your server is already running:
1. Stop it (Ctrl+C in the terminal)
2. Start it again: `npm start`

You should see:
```
🔥 Resume Rejection Analyzer API running on port 3000
📍 API endpoint: http://localhost:3000/analyze
🤖 Using: Google Gemini AI (FREE)
```

---

## ✅ Done!

Your app is now ready to use with **completely FREE** Google Gemini AI!

## Free Tier Limits

- **1,500 requests per day** (more than enough for testing and demos)
- **60 requests per minute**
- **100% FREE forever**
- No credit card required
- No billing setup needed

## Need Help?

If you see an error about API key:
1. Make sure there are no extra spaces in your `.env` file
2. Make sure you saved the `.env` file
3. Restart the server after adding the key

---

**🎉 That's it! Start analyzing resumes with brutal honesty!**
