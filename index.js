const { Client } = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (message.content.startsWith(`${prefix}setup`)) {
		message.channel.send('TODO');
	}
});

client.login(token);