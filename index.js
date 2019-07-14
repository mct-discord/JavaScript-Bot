const Discord = require('discord.js');
const fs = require('fs');
const Keyv = require('keyv');
const { prefix, discord_api_token, redis_connection_string } = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const canvas_access_tokens = new Keyv(redis_connection_string, { namespace: 'canvas_access_tokens' });
canvas_access_tokens.on('error', e => console.error('Keyv connection error:', e));

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('everybody 😶', { type: 'WATCHING' });
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	console.log(message.author.username + ': ' + message.content);
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'token') {
		client.commands.get('token').execute(message, args, canvas_access_tokens);
		return;
	}
	else {
		const canvas_access_token = await canvas_access_tokens.get(message.author.id);
		if (canvas_access_token === undefined) {
			message.channel.send('First tell me your Canvas Access Token using: ```!token <canvas_access_token>```');
			return;
		}
		if (command === 'courses') {
			client.commands.get('courses').execute(message, canvas_access_token);
			return;
		}
		if (command === 'favorites') {
			client.commands.get('favorites').execute(message, canvas_access_token);
			return;
		}
		if (command === 'name') {
			client.commands.get('name').execute(message, canvas_access_token);
			return;
		}
		if (command === 'profile') {
			client.commands.get('profile').execute(message, canvas_access_token);
			return;
		}
		message.channel.send('Error: command not found');
	}
});

client.login(discord_api_token);