'use strict';

// ---------------- 
//  Imports
// ----------------

const prompt = require('prompt-sync')({sigint: true});
import fs = require('fs');
import pt = require('path');
import WebSocket = require('ws');

// ---------------- 
//  Commandline
// ----------------

let path = '';
let id = '';
 
function getParameters() {
	path = prompt('Filepath: ');
	id = prompt('Computer ID: ');
}

getParameters();
initServer();

// ---------------- 
//  Filesystem
// ----------------

function getFileName(path: string): string {
	return pt.basename(path);
}

function getFileContent(path: string): string {
	let s = '';
	try {
		s = fs.readFileSync(__dirname + '\\' + path, 'utf-8');
	} catch (err) {
		console.error(err);
	}
	return s;
}

// ---------------- 
//  Websocket
// ----------------

function initServer() {
	const wss = new WebSocket.Server({port: 8080});

	wss.on('listening', () => {
		console.log('[CCCL] Listening for new connections...');
	});

	wss.on('connection', (ws, req) => {
		console.log(`[CCCL] Connected to ${req.connection.remoteAddress}.`);
		ws.on('message', data => {
			const message = data.toString().substr(0, 1);
			console.log(`[CCCL] Received computer ID: ${message}`);
			if (message === id) {
				console.log('[CCCL] Attempting to send data to computer...');
				ws.send(getFileName(path));
				ws.send(getFileContent(path));
				console.log('[CCCL] Refreshing parameters...')
				getParameters();
			}
		})
	});

	process.on('exit', () => {
		wss.close();
	});
}