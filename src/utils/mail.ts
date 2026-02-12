import { Resend } from 'resend';

export async function sendConfirmationEmail(email: string, name: string) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) return { success: true };

        const resend = new Resend(apiKey);

        await resend.emails.send({
            from: 'Cidade Viva Education <administrativo.education@cidadeviva.org>',
            to: email,
            subject: 'Bem-vindo ao Recrutamento Cidade Viva Education!',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                        <h1 style="color: #f59e0b; margin: 0; font-family: serif;">Cidade Viva Education</h1>
                    </div>
                    <div style="padding: 30px; color: #334155;">
                        <h2 style="margin-top: 0;">Olá, ${name}!</h2>
                        <p>Sua inscrição no nosso processo de recrutamento foi recebido com sucesso.</p>
                        <p>Nossa equipe da comissão organizadora já pode visualizar seu perfil e entrará em contato em breve para os próximos passos.</p>
                        <div style="margin: 30px 0; padding: 20px; bg: #f8fafc; border-radius: 8px; border-left: 4px solid #f59e0b;">
                            <strong>Dica:</strong> Fique de olho na sua caixa de entrada e também na pasta de spam.
                        </div>
                        <p>Atenciosamente,<br/><strong>Equipe Cidade Viva</strong></p>
                    </div>
                </div>
            `
        });
        return { success: true };
    } catch (err) {
        console.error("Confirmation Email Error:", err);
        return { success: true }; // Don't block registration if email fails
    }
}
