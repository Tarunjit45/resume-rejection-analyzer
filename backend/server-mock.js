require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Resume Rejection Analyzer API (MOCK MODE)',
        version: '1.0.0-mock'
    });
});

// Main analysis endpoint - MOCK VERSION (no API needed!)
app.post('/analyze', async (req, res) => {
    try {
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

        // MOCK ANALYSIS: Pattern-based brutal feedback
        const analysis = analyzeMockResume(resumeText);

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        res.json(analysis);

    } catch (error) {
        console.error('Analysis error:', error);

        res.status(500).json({
            error: 'Analysis failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Payment submission endpoint
app.post('/api/submit-payment', async (req, res) => {
    try {
        const { email, transactionId, resumeText } = req.body;

        // Validation
        if (!email || !transactionId || !resumeText) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Create payment record
        const payment = {
            id: Date.now().toString(),
            email,
            transactionId,
            resumeText: resumeText.substring(0, 500), // Store first 500 chars for reference
            status: 'pending',
            submittedAt: new Date().toISOString()
        };

        // Read existing payments
        const fs = require('fs');
        const path = require('path');
        const paymentsFile = path.join(__dirname, 'data', 'payments.json');

        let payments = [];
        try {
            const data = fs.readFileSync(paymentsFile, 'utf8');
            payments = JSON.parse(data);
        } catch (err) {
            // File doesn't exist or is empty, start fresh
            payments = [];
        }

        // Add new payment
        payments.push(payment);

        // Save to file
        fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));

        console.log(`💳 Payment submitted: ${transactionId} - ${email}`);

        res.json({
            success: true,
            message: 'Payment submitted successfully',
            paymentId: payment.id
        });

    } catch (error) {
        console.error('Payment submission error:', error);
        res.status(500).json({
            error: 'Failed to submit payment'
        });
    }
});

/**
 * MOCK RESUME ANALYZER
 * Uses pattern matching to provide brutal, realistic feedback WITHOUT AI
 */
function analyzeMockResume(resumeText) {
    const text = resumeText.toLowerCase();
    let score = 50; // Start neutral
    const reasons = [];
    let killingLine = '';

    // Detect generic phrases (BAD)
    const genericPhrases = [
        'worked on multiple projects',
        'modern technologies',
        'collaborated with team',
        'improved code quality',
        'various projects',
        'different projects',
        'responsible for',
        'helped with',
        'assisted in'
    ];

    let genericCount = 0;
    for (const phrase of genericPhrases) {
        if (text.includes(phrase)) {
            genericCount++;
            if (!killingLine) {
                // Find the actual line in original text
                const lines = resumeText.split('\n');
                for (const line of lines) {
                    if (line.toLowerCase().includes(phrase)) {
                        killingLine = line.trim();
                        break;
                    }
                }
            }
        }
    }

    if (genericCount >= 3) {
        score -= 25;
        reasons.push('Your resume is flooded with generic corporate speak that recruiters see 50 times a day. No specifics, no impact.');
    } else if (genericCount >= 1) {
        score -= 15;
        reasons.push('Multiple generic phrases that dilute your actual contributions. Recruiters skim past this instantly.');
    }

    // Check for metrics/numbers (GOOD)
    const hasMetrics = /\d+%|\$\d+|increased by|reduced by|saved \d+|\d+ users|\d+ hours/i.test(resumeText);
    if (!hasMetrics) {
        score -= 20;
        reasons.push('Zero measurable impact. No numbers = no credibility. Recruiters assume you exaggerate without proof.');
    }

    // Check for action verbs vs weak verbs
    const weakVerbs = ['worked', 'helped', 'assisted', 'involved', 'participated', 'responsible'];
    const strongVerbs = ['built', 'designed', 'implemented', 'launched', 'led', 'architected', 'optimized'];

    let weakVerbCount = 0;
    let strongVerbCount = 0;

    for (const verb of weakVerbs) {
        if (text.includes(verb)) weakVerbCount++;
    }
    for (const verb of strongVerbs) {
        if (text.includes(verb)) strongVerbCount++;
    }

    if (weakVerbCount > strongVerbCount) {
        score -= 15;
        reasons.push('You use passive language that screams "junior" or "not really involved." Senior candidates own their work.');
    }

    // Check resume length
    if (resumeText.length < 300) {
        score -= 10;
        reasons.push('Suspiciously short resume suggests lack of real experience or inability to articulate value.');
    }

    // Check for buzzwords without context
    const buzzwords = ['agile', 'scrum', 'innovative', 'passionate', 'team player', 'fast-paced', 'dynamic'];
    let buzzwordCount = 0;
    for (const word of buzzwords) {
        if (text.includes(word)) buzzwordCount++;
    }

    if (buzzwordCount >= 3) {
        score -= 10;
        if (reasons.length < 3) {
            reasons.push('Buzzword-heavy resume that reads like every other candidate. Zero differentiation.');
        }
    }

    // Check for specific project details
    const hasProjectDetails = /built|created|developed/.test(text) && /using|with|in/.test(text);
    if (!hasProjectDetails) {
        if (reasons.length < 3) {
            score -= 15;
            reasons.push('Projects listed without technical depth. Recruiters can\'t tell if you\'re lying or actually skilled.');
        }
    }

    // Ensure score is in valid range
    score = Math.max(15, Math.min(65, score)); // Keep it brutal (15-65 range)

    // Fill in reasons if we don't have 3
    const backupReasons = [
        'Resume lacks the storytelling that makes recruiters remember you over 299 other candidates.',
        'You list skills without context, making it impossible to gauge your actual proficiency level.',
        'No clear progression or growth narrative. Looks like you\'ve been doing the same thing repeatedly.',
        'Missing any sign of leadership, ownership, or going beyond basic job requirements.'
    ];

    while (reasons.length < 3) {
        reasons.push(backupReasons[reasons.length]);
    }

    // Find killing line if we don't have one
    if (!killingLine) {
        const lines = resumeText.split('\n').filter(l => l.trim().length > 20);
        // Find first line with weak language
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('worked') || lowerLine.includes('multiple') ||
                lowerLine.includes('various') || lowerLine.includes('different')) {
                killingLine = line.trim();
                break;
            }
        }

        // Fallback to first substantial line
        if (!killingLine && lines.length > 0) {
            killingLine = lines[0].trim();
        }
    }

    if (!killingLine) {
        killingLine = 'Overall weak presentation without concrete evidence of value';
    }

    return {
        score: score,
        reasons: reasons.slice(0, 3),
        killingLine: killingLine
    };
}

// Start server
app.listen(PORT, () => {
    console.log(`🔥 Resume Rejection Analyzer API running on port ${PORT}`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/analyze`);
    console.log(`🤖 Mode: MOCK (Pattern-based analysis - NO API NEEDED!)`);
    console.log(`💡 This version works 100% offline and is perfect for demos!`);
});
