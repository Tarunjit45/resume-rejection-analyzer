const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to handle AI-powered resume rewriting
 */
class AIFixerService {
    constructor() {
        if (process.env.GEMINI_API_KEY) {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        }
    }

    /**
     * Generates a "fixed" version of a resume
     * @param {string} originalResume - The original resume text
     * @param {string[]} rejectionReasons - Reasons why it was rejected
     */
    async generateFixedResume(originalResume, rejectionReasons) {
        if (!this.model) {
            return this.getMockFixedResume(rejectionReasons);
        }

        const prompt = `You are a professional resume rewriter who specializes in converting weak, rejected resumes into high-impact, result-oriented documents.

ORIGINAL RESUME:
${originalResume}

REJECTION REASONS FROM PREVIOUS ANALYSIS:
${rejectionReasons.join('\n- ')}

TASK:
Rewrite the resume content to fix every rejection reason listed. 
1. Use the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).
2. Add specific metrics (%, $, numbers) even if you have to reasonably estimate them based on the role.
3. Use strong action verbs (Spearheaded, Orchestrated, Optimized).
4. Remove generic fluff.
5. Keep the tone professional but high-impact.

OUTPUT FORMAT:
Provide the rewritten resume content ONLY. No introduction or outro.`;

        try {
            const result = await this.model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error('❌ AI Fixer failed:', error);
            return this.getMockFixedResume(rejectionReasons);
        }
    }

    getMockFixedResume(reasons) {
        return `[MOCK FIXED RESUME]
Optimized based on: ${reasons.join(', ')}

PROFESSIONAL SUMMARY
Dynamic professional who optimized delivery workflows by 40% and spearheaded cross-functional teams to drive ₹1.5Cr in annual revenue growth.

CORE ACHIEVEMENTS
- Optimized system performance using Node.js resulting in a 25% reduction in latency as measured by cloud monitoring tools.
- Spearheaded the redesign of the customer portal, increasing user retention by 15% through improved UX and faster load times.
- Orchestrated a team of 5 to successfully migrate legacy data to AWS, saving the company ₹20L in annual maintenance costs.

(This is a sample fixed resume because the AI service is in mock mode or failed.)`;
    }
}

module.exports = new AIFixerService();
