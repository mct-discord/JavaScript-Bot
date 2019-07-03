const { Client } = require('discord.js');
const { prefix, token, canvas_api_token } = require('./config.json');
const fetch = require('node-fetch');
const client = new Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'setup') {
		message.channel.send('WIP');
		await fetch('https://leho-howest.instructure.com/api/v1/courses?access_token=' + canvas_api_token)
			.then(response => response.json())
			.then(json => message.channel.send(JSON.stringify(json[0])));
	}
});

client.login(token);