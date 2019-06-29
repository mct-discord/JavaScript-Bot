import { Client } from 'discord.js';
import { token } from './config.json';
const client = new Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	console.log(message.content);
});

client.login(token);