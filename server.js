'use strict';

const Hapi = require('hapi');
const dotenv = require('dotenv').config();
const Slack = require('slack');

const client_id = process.env.SLACK_CLIENT_ID;
const bot = new Slack(client_id);

// Create a server with a host and port
const server = Hapi.server({
	host: process.env.HOST,
  port: process.env.HOST_PORT
});

// Add the route
server.route({
	method:'GET',
  path:'/hello',
	handler: async function(request,h){
		try {
			const response = await getFiles();
			if (response.ok) {
				console.log('LENGTH: ', response.files.length);
				try {
					await deleteFiles(response.files);
				} catch (e) {
					console.log('Error deleting file: ', e);
				}
				return 'ok';	
			}
 		} catch(e) {
			console.log(e);
		}
	}
});

async function deleteFiles(files){
	files.forEach((file, idx) => {
		try {
			const params = {
				file: file.id,
				token: process.env.SLACK_TOKEN
			}
			if (idx % 50 == 0) {
			//	setTimeout(() => deleteFile(params), 60000);
			} else {
				deleteFile(params);
			}
		} catch(e) {
			console.log('Unable To Delete File: ', e);	
		}
	});
}

async function deleteFile(params) {
	try {
		const file = await bot.files.delete(params);
		console.log('FILE: ', file);
		return 'ok';
	} catch(e) {
		console.log('Error deleting file: ', e);
	}
}

async function getFiles() {
	let date = new Date();
	date.setDate(date.getDate() - 30);
	const params = {
		token: process.env.SLACK_TOKEN,
		types: 'images,pdfs,zips',
		ts_to: date,
	}
	return await bot.files.list(params);
}

async function start() {
	try { 
		await server.start();
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
		console.log('Server running at:', server.info.uri);
};

start();
