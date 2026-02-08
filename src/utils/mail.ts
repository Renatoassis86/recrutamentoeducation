
// import { Resend } from 'resend';

export async function sendConfirmationEmail(email: string, name: string) {
    console.log(`[DISABLED] Would send email to ${email} for ${name}`);
    return { success: true };

    /* 
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Cidade Viva Education <nao-responda@cidadeviva.education>', 
            to: [email],
            subject: 'Confirmação de Inscrição - Chamada Editorial',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d97706;">Inscrição Recebida!</h1>
          <p>Olá, <strong>${name}</strong>.</p>
          <p>Sua inscrição na <strong>Chamada Editorial para Prospecção de Autores</strong> do Sistema Cidade Viva Education foi recebida com sucesso.</p>
          <p>Nossa equipe analisará seus dados e documentos. Fique atento ao seu email para futuras comunicações sobre as próximas etapas.</p>
          <br/>
          <p>Atenciosamente,</p>
          <p><strong>Equipe Cidade Viva Education</strong></p>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Exception sending email:', err);
        return { success: false, error: err };
    }
    */
}
