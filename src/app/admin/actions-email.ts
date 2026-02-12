"use server";

import { Resend } from 'resend';

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
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return { error: "Erro de Configuração: API Key do e-mail não encontrada no servidor." };
        }

        const resend = new Resend(apiKey);

        console.log(`📧 Iniciando envio para ${recipients.length} destinatário(s)`);

        const { data, error } = await resend.emails.send({
            from: 'Cidade Viva Education <administrativo.education@cidadeviva.org>',
            to: recipients,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Comunicação Cidade Viva Education</h2>
                    <div style="font-size: 16px; line-height: 1.6; color: #444; white-space: pre-wrap;">${message}</div>
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
            console.error("❌ Erro no Resend:", error);
            return { error: error.message };
        }

        console.log("✅ E-mail enviado com sucesso:", data?.id);
        return { success: true };
    } catch (err: any) {
        console.error("🔥 Falha Crítica no Envio:", err);
        return { error: `Erro inesperado no servidor: ${err.message}` };
    }
}

export async function sendContactFormEmail(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return { error: "Erro de configuração de e-mail no servidor." };
        }

        const resend = new Resend(apiKey);

        const { error } = await resend.emails.send({
            from: 'Sistema de Recrutamento <administrativo.education@cidadeviva.org>',
            to: 'administrativo.education@cidadeviva.org',
            subject: `[CONTATO SITE] ${data.subject}`,
            replyTo: data.email,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #0f172a; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Nova Mensagem de Contato</h2>
                    <p><strong>Nome:</strong> ${data.name}</p>
                    <p><strong>E-mail:</strong> ${data.email}</p>
                    <p><strong>Telefone:</strong> ${data.phone}</p>
                    <p><strong>Assunto:</strong> ${data.subject}</p>
                    <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <p style="margin-top: 0; color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: bold;">Mensagem:</p>
                        <div style="white-space: pre-wrap; color: #334155;">${data.message}</div>
                    </div>
                </div>
            `
        });

        if (error) return { error: error.message };
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
