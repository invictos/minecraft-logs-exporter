/**
 * This uses https://api.mcstatus.io/v2/status/java/{ip} to check if the server is online & returns the user list
 */

const HOST = process.env.MCO11Y_HOST;

async function handler(req, res){

    if (!HOST) {
        return res.status(500).send('Server host not set');
    }

    const response = await fetch(`https://api.mcstatus.io/v2/status/java/${HOST}`);
    const data = await response.json();

    if (!data.online) {
        return res.status(500).send('Server is offline');
    }

    const players = data.players.list.map(player => player.name_clean);

    const result = [
        `Server is: ${data.online ? 'Online' : 'Offline'}`,
        `Players (${players.length}): ${players.join(', ')}`,
    ];

    res.send(result.join('\n'));
}

exports.handler_online = handler;