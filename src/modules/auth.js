const basicAuth = require('express-basic-auth');

const middleware = basicAuth({
    users: { 
        [process.env.MCO11Y_AUTH_USER || 'admin']: process.env.MCO11Y_AUTH_PASSWORD || 'admin' 
    },
    challenge: true,
});


exports.middleware_auth = middleware;