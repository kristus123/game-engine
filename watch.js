const chokidar = require('chokidar');
const { exec, spawn } = require('child_process');
const express = require('express');

const app = express();
app.use(express.static('dist'));
app.listen(5000, () => console.log('Serving dist on port 5000'));



function runCommand(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

let httpServerProcess = null; // Store the HTTP server process to be able to stop/restart it
function startHttpServer() {
    if (httpServerProcess) {
        console.log('HTTP server is already running.');
        return;
    }

    httpServerProcess = spawn('node', ['http_server/main.js'], { stdio: 'inherit' });

    httpServerProcess.on('close', (code) => {
        console.log(`HTTP server stopped with code ${code}`);
        httpServerProcess = null; // Reset when the server stops
    });
}

// Function to stop the HTTP server
function stopHttpServer() {
    if (httpServerProcess) {
        httpServerProcess.kill(); // Kill the server process
        console.log('HTTP server stopped.');
    } else {
        console.log('No HTTP server is running.');
    }
}

// Watch for changes in relevant files (including http_server)
const watcher = chokidar.watch(
    [
        'build_tools/generate_dist.js',
        'socket_server/start_socket_servers.js',
        'http_server/**/*.js',
        'dist/**/*.html',
        'dist/**/*.css',
        'dist/**/*.js',
        'dist/**/*.png',
        'dist/**/*.jpeg',
        'dist/**/*.jpg',
        'dist/**/*.gif'
    ],
    { persistent: true }
);

watcher
    .on('change', (path) => {
        console.log(`File changed: ${path}`);

		runCommand('node build_tools/generate_dist.js');
		runCommand('node socket_server/start_socket_servers.js');

		stopHttpServer()
		startHttpServer()
    })
    .on('add', (path) => {
        console.log(`File added: ${path}`);

		startHttpServer()
    })
    .on('unlink', (path) => {
        console.log(`File removed: ${path}`);
    })
    .on('error', (error) => {
        console.error(`Watcher error: ${error}`);
    });

startHttpServer();

