import { getClientToken } from 'kroger-api-wrapper/lib';

const clientBase64 = process.env.KROGER_CLIENT_BASE64;
const scope = 'product.compact';

export async function getKrogerToken() {
    const response = await getClientToken({
        clientBase64,
        scope,
    });

    return response.data.access_token;
}