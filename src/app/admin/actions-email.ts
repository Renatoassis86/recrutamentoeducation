"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminEmail({
    recipients,
    subject,
    message
}: {
    recipients: string[];
    subject: string;
    message: string;
}) {
    try {
        if (!process.env.RESEND_API_KEY) {
            return { error: "Configuração de e-mail (Resend) não encontrada." };
        }

        const { data, error } = await resend.emails.send({
            from: 'Cidade Viva Education <administrativo.education@cidadeviva.org>',
            to: recipients,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Comunicação Cidade Viva Education</h2>
                    <div style="font-size: 16px; line-height: 1.6; color: #444; white-space: pre-wrap;">
                        ${message}
                    </div>
                    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #999;">
                        Este é um e-mail oficial do sistema de recrutamento Cidade Viva Education.<br/>
                        Caso precise de ajuda, responda diretamente a este e-mail.
                    </p>
                </div>
            `,
            replyTo: 'administrativo.education@cidadeviva.org'
        });

        if (error) {
            console.error("Resend Error:", error);
            return { error: error.message };
        }

        return { success: true };
    } catch (err: any) {
        console.error("Action Email Error:", err);
        return { error: err.message };
    }
}
