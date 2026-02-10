// Load env only in local (Vercel provides them natively)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const emailService = require('./services/email-service');
const aiFixer = require('./services/ai-fixer');
const pdfService = require('./services/pdf-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Proactive API Key Check
if (!process.env.GEMINI_API_KEY) {
    console.warn('❌ CRITICAL: GEMINI_API_KEY is missing from process.env');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// The brutal recruiter system prompt (CORE PRODUCT ASSET - DO NOT MODIFY)
const SYSTEM_PROMPT = `You are a senior technical recruiter with 15+ years of experience who screens 300+ resumes per day.

Your job is to brutally analyze the given resume or LinkedIn text and explain WHY it gets rejected in under 6 seconds.

Rules:
- Be direct, blunt, and factual.
- Do NOT encourage or motivate.
- Assume the candidate is average unless proven otherwise.
- Think like an ATS + human recruiter combined.
- Expose copied projects, vague claims, weak skills, and red flags.
- If something sounds impressive but lacks proof, call it out.
- If lines are generic, say they are generic.
- If the resume is strong, still find weaknesses.

Output format (STRICT):

REJECTION SCORE: X / 100

WHY YOU GET REJECTED:
1. <Reason>
2. <Reason>
3. <Reason>

THE LINE THAT KILLS YOUR CHANCES:
"<Exact line from the resume>"

Do NOT give solutions or fixes.
Do NOT rewrite anything.
Only diagnose.`;

// Health check endpoint (for Vercel and local)
app.get(['/', '/api/health'], (req, res) => {
    res.json({
        status: 'ok',
        message: 'Resume Rejection Analyzer API',
        api_key_set: !!process.env.GEMINI_API_KEY,
        version: '1.0.1'
    });
});

// Verify Transaction and Unlock Fix
app.post(['/verify-transaction', '/api/verify-transaction'], async (req, res) => {
    try {
        const { utr, email, originalResume, rejectionReasons } = req.body;

        if (!utr || utr.length < 12) {
            return res.status(400).json({ error: 'Invalid UTR' });
        }

        console.log(`💰 New Transaction: ${utr} for ${email}`);

        // 1. Generate Fixed Content via AI
        const fixedContent = await aiFixer.generateFixedResume(originalResume, rejectionReasons);

        // 2. Generate PDF
        const pdfBuffer = await pdfService.generateResumePDF(fixedContent);

        // 3. Send Email (Async)
        emailService.sendFixedResume(email, fixedContent, pdfBuffer)
            .catch(err => console.error('Delayed email sending failed:', err));

        // 4. Return success to frontend immediately
        res.json({
            success: true,
            fixedContent: fixedContent
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Failed to process transaction' });
    }
});

// Main analysis endpoint
app.post(['/analyze', '/api/analyze'], async (req, res) => {
    try {
        console.log('🔍 Received analysis request');
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured in Vercel environment variables.');
        }

        const { resumeText } = req.body;

        // Validation
        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({
                error: 'Resume text is required'
            });
        }

        if (resumeText.length < 50) {
            return res.status(400).json({
                error: 'Resume text is too short. Please provide more details.'
            });
        }

        // Call Google Gemini API
        const prompt = `${SYSTEM_PROMPT}\n\nResume to analyze:\n${resumeText}`;

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 600,
            },
        });

        const rawResponse = result.response.text();

        // Parse the response
        const parsedData = parseRecruitingResponse(rawResponse);

        res.json(parsedData);

    } catch (error) {
        console.error('Analysis error:', error);

        // Check for API key issues
        if (error.message?.includes('API key') || error.message?.includes('API_KEY')) {
            return res.status(500).json({
                error: 'Invalid Gemini API key. Please check your .env file.'
            });
        }

        // Check for quota/rate limit issues
        if (error.message?.includes('quota') || error.message?.includes('limit')) {
            return res.status(500).json({
                error: 'API quota exceeded. Please wait a moment and try again.'
            });
        }

        res.status(500).json({
            error: 'Analysis failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * Parse the OpenAI response to extract structured data
 */
function parseRecruitingResponse(response) {
    try {
        // Extract rejection score
        const scoreMatch = response.match(/REJECTION SCORE:\s*(\d+)\s*\/\s*100/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;

        // Extract reasons (look for numbered list)
        const reasonsSection = response.match(/WHY YOU GET REJECTED:([\s\S]*?)THE LINE THAT KILLS/i);
        let reasons = [];

        if (reasonsSection) {
            const reasonsText = reasonsSection[1];
            const reasonMatches = reasonsText.match(/\d+\.\s*([^\n]+)/g);

            if (reasonMatches && reasonMatches.length >= 3) {
                reasons = reasonMatches.slice(0, 3).map(r =>
                    r.replace(/^\d+\.\s*/, '').trim()
                );
            }
        }

        // Fallback: if we didn't get 3 reasons, extract any sentences
        if (reasons.length < 3) {
            const sentences = reasonsSection ?
                reasonsSection[1].split(/[.!]\s+/).filter(s => s.trim().length > 20) :
                response.split(/[.!]\s+/).filter(s => s.trim().length > 20);

            reasons = sentences.slice(0, 3).map(s => s.trim());
        }

        // Extract the killing line
        const killingLineMatch = response.match(/THE LINE THAT KILLS YOUR CHANCES:\s*"([^"]+)"/i);
        let killingLine = killingLineMatch ? killingLineMatch[1] : '';

        // Fallback: try without quotes
        if (!killingLine) {
            const altMatch = response.match(/THE LINE THAT KILLS YOUR CHANCES:\s*([^\n]+)/i);
            killingLine = altMatch ? altMatch[1].replace(/^["']|["']$/g, '').trim() :
                'Generic phrasing throughout the resume';
        }

        return {
            score: Math.max(0, Math.min(100, score)), // Ensure 0-100 range
            reasons: reasons.length > 0 ? reasons : [
                'Lacks specific achievements and metrics',
                'Generic language that blends with other resumes',
                'Missing proof of impact and value'
            ],
            killingLine: killingLine || 'No specific line identified - overall weakness detected'
        };

    } catch (parseError) {
        console.error('Parse error:', parseError);

        // Fallback response if parsing completely fails
        return {
            score: 35,
            reasons: [
                'Unable to extract clear value proposition',
                'Resume structure makes it hard to identify key strengths',
                'Lacks the clarity recruiters need for quick screening'
            ],
            killingLine: 'Overall presentation needs improvement'
        };
    }
}

// Start server ONLY if running directly (not via Vercel/serverless import)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🔥 Resume Rejection Analyzer API running on port ${PORT}`);
        console.log(`📍 API endpoint: http://localhost:${PORT}/analyze`);
        console.log(`🤖 Using: Google Gemini AI (FREE)`);

        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️  WARNING: GEMINI_API_KEY not found in environment variables!');
            console.warn('   Get your FREE API key at: https://makersuite.google.com/app/apikey');
            console.warn('   Then add it to your .env file');
        }
    });
}

module.exports = app;
