# 🎭 MOCK MODE - No API Needed!

Your Resume Rejection Analyzer now has a **MOCK VERSION** that works **100% offline** without any API!

## Why Use Mock Mode?

- ✅ **Zero API costs** - No Gemini, no OpenAI, nothing
- ✅ **Works instantly** - No API keys needed
- ✅ **Perfect for demos** - Show the UI and concept
- ✅ **Brutal analysis** - Uses pattern matching to give realistic feedback
- ✅ **Offline-first** - No internet required

## How to Run Mock Mode

### Stop the current server (if running):
```bash
# Press Ctrl+C
```

### Start the MOCK server:
```bash
npm run mock
```

You should see:
```
🔥 Resume Rejection Analyzer API running on port 3000
📍 API endpoint: http://localhost:3000/analyze
🤖 Mode: MOCK (Pattern-based analysis - NO API NEEDED!)
💡 This version works 100% offline and is perfect for demos!
```

### Open the frontend:
Your frontend `index.html` will work exactly the same! No changes needed.

---

## How It Works

The mock server uses **smart pattern matching** to analyze resumes:

1. **Detects generic phrases**: "worked on multiple projects", "modern technologies", etc.
2. **Checks for metrics**: Numbers, percentages, measurable impact
3. **Analyzes verb strength**: Active vs passive language
4. **Identifies buzzwords**: Without substance
5. **Grades project descriptions**: Depth and specificity

**Result**: Brutal, realistic feedback that matches the AI's tone!

---

## Example Output

**Input** (generic resume):
```
Experienced Software Developer with 3+ years in web development.
Worked on multiple projects using modern technologies.
```

**Mock Analysis**:
- **Score**: 25/100
- **Reasons**:
  1. "Your resume is flooded with generic corporate speak..."
  2. "Zero measurable impact. No numbers = no credibility..."
  3. "You use passive language that screams junior..."
- **Killing Line**: "Worked on multiple projects using modern technologies."

---

## Switch Between Modes

**Mock Mode** (no API):
```bash
npm run mock
```

**Real Gemini Mode** (when API works):
```bash
npm start
```

Both use the same frontend - just switch the backend!

---

## Notes

- Mock mode is **intentionally brutal** - just like the real AI
- Pattern matching is surprisingly effective for this use case
- Perfect for **demos, testing, and UI development**
- When Gemini API works, you can switch back instantly

---

**🎉 Try it now! Your app works without any API!**
