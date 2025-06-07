import { config } from 'dotenv';
import { OAuthApp } from '@octokit/oauth-app';

config();

const app = new OAuthApp({
    clientType: 'oauth-app',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

export async function handler(event) {
    const urlParams = new URLSearchParams(event.queryStringParameters);

    if (urlParams.has('code')) {
        const code = urlParams.get('code');

        try {
            const { authentication } = await app.createToken({ code });
            const token = authentication.token;
            return {
                statusCode: 302,
                headers: {
                    Location: `https://albeoris.github.io/Memoria?token=${token}`
                }
            };
        } catch (error) {
            return { statusCode: 500, body: 'OAuth error: ' + error.message };
        }
    } else {
        const authUrl = app.getWebFlowAuthorizationUrl({
            redirectUrl: process.env.REDIRECT_URL,
            scopes: ['repo'],
        });

        return {
            statusCode: 302,
            headers: { Location: authUrl.url },
        };
    }
}