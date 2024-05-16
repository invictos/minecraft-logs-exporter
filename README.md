# minecraft-logs-exporter
This is a simple tool to read Minecraft logs and exposes them on a HTTP server.

## Usage:
- `/` - Returns server status, player count and player list. (via [mc-status](https://mcstatus.io/))
- `/logs` - Returns the server logs across all files.
- `/activity` - Returns the server activity (logins, logouts)

### Options
- `&raw` - Returns the raw logs without any formatting.
- `/:DAYS` - Returns the logs from the last `:DAYS` days. (e.g. `/logs/2`)

## Installation:
1. Clone the repository.
2. Install the dependencies with `node install`.
3. Run the server with `node index.js`.

### Docker
1. Build the image with `docker build -t minecraft-logs-exporter .`.
2. Run the container, mounting the logs folder with `docker run -d -p 3000:3000 -v logs:/app/logs minecraft-logs-exporter`.
3. Access the server on `http://localhost:3000`.

## Configuration:
- `MCO11Y_PORT` - The port the server will listen on. (default: 3000)
- `MCO11Y_SERVER` - The server address to check the status of.
- `MCO11Y_AUTH_ENABLED` - Enable basic authentication. (default: true)
- `MCO11Y_AUTH_USER` - The username for basic authentication. (default: "admin")
- `MCO11Y_AUTH_PASSWORD` - The password for basic authentication. (default: "admin")
- `MCO11Y_LOGS_PATH` - The path to the Minecraft logs.


### Example:
```bash
MCO11Y_HOST=foobar.net MCO11Y_PORT=2999 MCO11Y_AUTH_ENABLED=true MCO11Y_AUTH_USER=toto MCO11Y_AUTH_PASSWORD=toto node index.js
```
