require('dotenv').config();
const { OAuthApp } = require('@octokit/oauth-app');

const app = new OAuthApp({
    clientType: 'oauth-app',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

exports.handler = async (event) => {
    const urlParams = new URLSearchParams(event.queryStringParameters);

    if (urlParams.has('code')) {
        const code = urlParams.get('code');

        try {
            const { authentication } = await app.createToken({ code });
            const token = authentication.token;

            // Redirect back with token
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
        // If there is no code, send back to autorize
        const authUrl = app.getWebFlowAuthorizationUrl({
            redirectUrl: process.env.REDIRECT_URL,
            scopes: ['repo'],
        });

        return {
            statusCode: 302,
            headers: { Location: authUrl.url },
        };
    }
};