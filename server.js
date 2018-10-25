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
		const params = {
			token: process.env.SLACK_TOKEN,
			types: 'images,pdfs,zips,',
		}
		try {
			const response = await bot.files.list(params);
			console.log('RESPONSE: ', response); 
 		} catch(e) {
			console.log(e);
		}
	}
});


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
