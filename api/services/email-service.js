const nodemailer = require('nodemailer');

/**
 * Service to handle automated email delivery of fixed resumes
 */
class EmailService {
    constructor() {
        this.transporter = null;
        this.isConfigured = false;
        this.init();
    }

    init() {
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        if (user && pass) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user, pass }
            });
            this.isConfigured = true;
            console.log('📧 Email Service: Configured and ready');
        } else {
            console.warn('⚠️ Email Service: EMAIL_USER/EMAIL_PASS not found in .env. Emails will be logged but not sent.');
        }
    }

    /**
     * Send fixed resume to customer
     * @param {string} to - Customer email
     * @param {string} fixedResumeText - The AI-rewritten resume text
     * @param {Buffer} pdfBuffer - Optional PDF attachment
     */
    async sendFixedResume(to, fixedResumeText, pdfBuffer = null) {
        if (!this.isConfigured) {
            console.log(`📡 [MOCK EMAIL] To: ${to}\nContent: Resume fix delivered successfully.`);
            return true;
        }

        const mailOptions = {
            from: `"Resume Fixer" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: '🚀 Your Fixed Resume is Ready!',
            text: `Hi there,\n\nCongratulations on unlocking your fixed resume! We've analyzed the rejection triggers and rebuilt your content to be high-impact and metric-driven.\n\nHere is your fixed content:\n\n---\n${fixedResumeText}\n---\n\nAttached is an ATS-friendly PDF copy.\n\nGood luck with your applications!\n\nBest,\nResume Rejection Analyzer Team`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #7c3aed;">🚀 Your Fixed Resume is Ready!</h2>
                    <p>Hi there,</p>
                    <p>Congratulations on unlocking your fixed resume! We've analyzed the rejection triggers and rebuilt your content to be high-impact and metric-driven.</p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${fixedResumeText}</div>
                    <p>Attached is an ATS-friendly PDF copy of your improved resume.</p>
                    <p>Go get that job! 🎯</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">If you didn't request this or have issues, contact us at tarunjit24@gmail.com</p>
                </div>
            `,
            attachments: pdfBuffer ? [
                {
                    filename: 'Improved_Resume.pdf',
                    content: pdfBuffer
                }
            ] : []
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent to ${to}: ${info.messageId}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
