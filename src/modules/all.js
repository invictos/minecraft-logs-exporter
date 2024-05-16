const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const readline = require('readline');
const moment = require('moment');

const DEFAULT_DAYS = 100;

const LOGS_PATH = process.env.MCO11Y_LOGS_PATH || '../../logs';

console.log(`Logs path: ${path.join(__dirname, LOGS_PATH)}`);

async function handlerLogs(req, res){
    const { X } = req.params;
    const days = parseInt(X);

    const logs = await getLogs(days || DEFAULT_DAYS);
    res.send(logs.join('\n'));
}

async function handlerPlayerActivity(req, res){
    const { X } = req.params;
    const days = parseInt(X);

    const logs = await getLogs(days || DEFAULT_DAYS);

    const playerActivityLogs = logs.filter(log => {
        const logMessage = log.slice(21); // Extract message from log
        return /^.* \[Server thread\/INFO\]: .*(joined the game|left the game)/.test(logMessage);
    });
    res.send(playerActivityLogs.join('\n'));
}

async function getLogs(days){
    const logsDir = path.join(__dirname, LOGS_PATH);
    let files = fs.readdirSync(logsDir);
    let logs = [];

    // Sort files by name (which includes the date)
    files = files.sort();

    for (let file of files) {
        const filePath = path.join(logsDir, file);
        const fileStream = fs.createReadStream(filePath);
        const isLastestFile = file === 'latest.log'
        
        let date = '';
        if (isLastestFile) {
            const stats = fs.statSync(filePath);
            date = moment(stats.mtime).format('YYYY-MM-DD'); // Use last modified date for latest.log
        } else {
            date = file.slice(0, 10); // Extract date from filename
        }

        let lineStream;
        if (path.extname(file) === '.gz') {
            const gunzip = zlib.createGunzip();
            lineStream = readline.createInterface({
                input: fileStream.pipe(gunzip),
                crlfDelay: Infinity
            });
        } else {
            lineStream = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });
        }

        for await (let line of lineStream) {
            const timestampPattern = /^\[\d{2}:\d{2}:\d{2}\]/; // Regular expression for timestamp
            let timestamp = line.slice(1, 9); // Extract timestamp

            // Check if timestamp matches the expected format
            if (!timestampPattern.test(`[${timestamp}]`)) {
                timestamp = '00:00:00';
            } else {
                line = line.slice(11); // Slice the line to remove the timestamp
            }

            const formattedTimestamp = moment(`${date} ${timestamp}`, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            logs.push(`[${formattedTimestamp}] ${line}`);
        }
    }

    const currentDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
    logs = logs.filter(log => {
        const logDate = log.slice(1, 11); // Extract date from log
        return moment(logDate).isBetween(startDate, currentDate, null, '[]');
    });

    return logs;
}

exports.handler_logs = handlerLogs
exports.handler_player_activity = handlerPlayerActivity;