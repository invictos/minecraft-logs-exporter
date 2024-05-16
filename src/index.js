const express = require('express');

const { handler_logs, handler_player_activity } = require('./modules/all');
const { handler_online } = require('./modules/online');
const { middleware_auth } = require('./modules/auth');
const { middleware_raw } = require('./modules/raw');

const AUTH_ENABLED = process.env.MCO11Y_AUTH_ENABLED !== 'false';

const app = express();

const PORT = parseInt(process.env.MCO11Y_PORT) || 3000;

if(AUTH_ENABLED){
    app.use(middleware_auth);
}

app.use(middleware_raw);

app.get('/', handler_online);

app.get('/logs/:X?', handler_logs);

app.get('/activity/:X?', handler_player_activity);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));