const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function middleware(req, res, next) {
    const oldSend = res.send;
    res.send = function(data) {
        if (req.query.raw !== undefined || req.query.Raw !== undefined) {
            oldSend.call(res, data);
        } else {
            const escapedData = data.split('\n').map(line => `${escapeHtml(line)}</br>`).join('\n');
            oldSend.call(res, escapedData);
        }
    }
    next();
}

exports.middleware_raw = middleware;