'use server';

// Server actions for Google Apps Script interaction
export async function callGASAction(data: any) {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    if (!gasUrl || gasUrl.includes('YourActualID')) return { success: false, message: 'GAS URL belum dikonfigurasi. Silakan atur NEXT_PUBLIC_GAS_URL di .env.local atau Vercel.' };
    try {
        const response = await fetch(gasUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
        });
        return await response.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function getGASStats() {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    if (!gasUrl || gasUrl.includes('YourActualID')) return { success: false, message: 'GAS URL belum dikonfigurasi.' };
    try {
        const response = await fetch(`${gasUrl}?action=getStats`);
        return await response.json();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}