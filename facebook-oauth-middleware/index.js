const http = require('http');
const fetch = require('node-fetch');
const crypto = require('crypto');

const cookieDomain =  process.env.COOKIE_DOMAIN || 'lvh.me';
const app_url = process.env.APP_URL || 'https://lvh.me:8125';
const middleware_url = process.env.MIDDLEWARE_URL || 'https://auth.lvh.me:8125';
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const cookieName =  process.env.COOKIE_NAME || 'check';

const port = 8125;
const redirect_uri = `${middleware_url}/auth`;
const authRedurectUrl = `https://www.facebook.com/v4.0/dialog/oauth?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=email,user_friends&response_type=code&auth_type=rerequest&display=popup`;

function shaSignature(text) {
    return crypto.createHmac('sha256', client_secret).update(text).digest('base64');
}

function parseGetParams(str = '') {
    return str.split('&').reduce((res, pair) => {
        const parts = pair.split('=');
        res[parts[0]] = parts[1] || true;
        return res;
    }, {});
}

function validCookies(cookie = '') {
    const cookies = cookie.split(/\s*;\s*/);
    const check = cookies.find((c) => c.startsWith(cookieName));
    if (!check) {
        console.log('@ No check cookies', check, 'cookieName=', cookieName, 'cookies', cookies);
        return false;
    }

    const parts = check.slice(cookieName.length + 1).split('^');
    if (parts.length !== 2) {
        console.log('@ No parts', parts);
        return false;
    }

    if (shaSignature(parts[1]) !== parts[0]) {
        console.log('@ SHA is different', parts, shaSignature(parts[1]));
        return false;
    }

    const userData = parts[1].split('|');
    if (userData.length !== 4) {
        console.log('@ wron user data', userData);
        return false;
    }

    if (Number(userData[3]) < new Date().getTime()) {
        console.log('@ bad date ', Number(userData[3]), new Date().getTime());
    }
    return Number(userData[3]) > new Date().getTime();
}

function fetchUserData(code) {
    return fetch(
        `https://graph.facebook.com/v4.0/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirect_uri}&code=${code}`
    )
    .then((resp) => {
        if (resp.status >= 400) {
            throw new Error('Failed to obtain access_token ' + resp.status);
        }
        return resp.json();
    })
    .then(({ access_token, expires_in }) => {
        return fetch(
            `https://graph.facebook.com/me?access_token=${access_token}&fields=id,email,first_name,last_name`
        )
        .then((resp) => resp.json())
        .then((resp) => [resp, access_token, expires_in]);
    });
}

http.createServer(function (request, response) {
    console.log('--> req', request.url, request.headers.cookie)
    if (request.url.startsWith('/auth')) {
        const params = parseGetParams(request.url.split('/auth?')[1]);
        fetchUserData(params.code)
            .then(([data, acess_token, expiration]) => {
                const expires = new Date().getTime() + Number(expiration);
                const body = `${data.email}|${encodeURIComponent(data.first_name)}|${encodeURIComponent(data.last_name)}|${expires}`;
                const hash = shaSignature(body);
                const resp = hash + '^' + body;
                response
                    .writeHead(301, {
                        Location: app_url,
                        'Set-Cookie': `${cookieName}=${resp}; domain=${cookieDomain}; HttpOnly; Max-Age=${Number(expiration) / 1000};`,
                    })
                    .end();
            })
            .catch((e) => response
                    .writeHead(500, {
                        'Content-Length': Buffer.byteLength(e.message),
                        'Content-Type': 'text/plain',
                    })
                    .end(e.message)
            );
    } else if (validCookies(request.headers.cookie)) {
        response.writeHead(200).end();
    } else {
        response.writeHead(302, { Location: authRedurectUrl }).end();
    }
}).listen(port, () => console.log(`Server started on port: ${port}`));