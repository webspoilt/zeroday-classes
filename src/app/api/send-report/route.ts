import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email, name, testTitle, score, totalQuestions, correct, wrong, unattempted, timeTaken, questions, answers } = await req.json();

        // 1. Configure Transporter
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        if (!user || !pass) {
            console.log('⚠️ Email credentials missing. Simulating send:', { email, score, testTitle });
            return NextResponse.json({ success: true, message: 'Email simulated (check console)' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        // 2. Build Detailed Analysis HTML
        let detailsHtml = '';
        if (questions && answers) {
            detailsHtml = `
                <h3 style="color: #2563eb; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Detailed Analysis</h3>
                <div style="margin-top: 20px;">
            `;

            questions.forEach((q: any, index: number) => {
                const userAnsIndex = answers[q.globalIndex];
                const isSkipped = userAnsIndex === undefined;
                const isCorrect = userAnsIndex === q.correct;

                const statusColor = isCorrect ? '#16a34a' : (isSkipped ? '#64748b' : '#dc2626');
                const statusText = isCorrect ? 'Correct' : (isSkipped ? 'Skipped' : 'Wrong');

                detailsHtml += `
                    <div style="margin-bottom: 20px; padding: 15px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid ${statusColor};">
                        <div style="font-weight: bold; margin-bottom: 8px; color: #334155;">Q${index + 1}. ${q.question}</div>
                        <div style="font-size: 14px; margin-bottom: 4px;">
                            <span style="color: #64748b;">Your Answer:</span> 
                            <span style="font-weight: bold; color: ${statusColor};">
                                ${isSkipped ? 'Skipped' : q.options[userAnsIndex]}
                            </span>
                        </div>
                        <div style="font-size: 14px; margin-bottom: 4px;">
                            <span style="color: #64748b;">Correct Answer:</span> 
                            <span style="font-weight: bold; color: #16a34a;">
                                ${q.options[q.correct]}
                            </span>
                        </div>
                        ${q.explanation ? `
                            <div style="margin-top: 8px; font-size: 13px; color: #475569; background-color: #e2e8f0; padding: 8px; border-radius: 4px; font-family: monospace; white-space: pre-wrap;">
                                <strong>Explanation:</strong><br/>${q.explanation}
                            </div>
                        ` : ''}
                    </div>
                `;
            });

            detailsHtml += `</div>`;
        }

        // 3. Email Content using detailsHtml
        const subject = `Your Mock Test Results: ${testTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-w-600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #2563eb;">ZeroDay Classes - Test Report</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Here is your performance report for <strong>${testTitle}</strong>.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f3f4f6;">
                        <th style="padding: 10px; text-align: left;">Metric</th>
                        <th style="padding: 10px; text-align: left;">Value</th>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">Score</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>${score}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">Correct / Wrong</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; color: green;">${correct} <span style="color:red">/ ${wrong}</span></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">Accuracy</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${((correct / totalQuestions) * 100).toFixed(0)}%</td>
                    </tr>
                     <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">Time Taken</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">${timeTaken}</td>
                    </tr>
                </table>

                ${detailsHtml}

                <div style="margin-top: 30px; text-align: center;">
                    <a href="https://zeroday-classes-main.vercel.app/dashboard" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Detailed Analysis</a>
                </div>
                
                <p style="margin-top: 30px; font-size: 12px; color: #666;">
                    Keep practicing! <br>
                    Team ZeroDay Classes
                </p>
            </div>
        `;

        // 3. Send
        await transporter.sendMail({
            from: '"ZeroDay Classes" <no-reply@zeroday.com>',
            to: email,
            subject,
            html,
        });

        return NextResponse.json({ success: true, message: 'Email sent successfully' });

    } catch (error: any) {
        console.error('Email send error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
