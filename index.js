const { Client } = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'setup') {
		message.channel.send('TODO');
	}
});

client.login(token);