
export async function sendConfirmationEmail(email: string, name: string) {
    console.log(`[DISABLED] Email confirmation skipped for ${email} (${name})`);
    return { success: true };
}
