const { Client } = require('discord.js');
const Keyv = require('keyv');
const { prefix, token, redis_connection_string } = require('./config.json');
const fetch = require('node-fetch');

const client = new Client();
const keyv = new Keyv(redis_connection_string);
keyv.on('error', err => console.error('Keyv connection error:', err));

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	message.channel.send('WIP');
	if (command === 'courses') {
		const courses = [];
		const canvas_api_token = await keyv.get('canvas_api_token');
		await fetch('https://leho-howest.instructure.com/api/v1/courses?access_token=' + canvas_api_token)
			.then(response => response.json())
			.then(json => {
				for (let i = 0; i < json.length; i++) {
					courses.push(json[i].name);
				}
				message.channel.send(courses);
			});
	}
	else if (command === 'favorites') {
		const favorites = [];
		const canvas_api_token = await keyv.get('canvas_api_token');
		await fetch('https://leho-howest.instructure.com/api/v1/users/self/favorites/courses?access_token=' + canvas_api_token)
			.then(response => response.json())
			.then(json => {
				for (let i = 0; i < json.length; i++) {
					favorites.push(json[i].name);
				}
				message.channel.send(favorites);
			});
	}
	else if (command === 'name') {
		const canvas_api_token = await keyv.get('canvas_api_token');
		await fetch('https://leho-howest.instructure.com/api/v1/users/self?access_token=' + canvas_api_token)
			.then(response => response.json())
			.then(json => {
				const names = json.name.split(' ');
				for (let i = 0; i < names.length; i++) {
					names[i] = names[i].charAt(0).toUpperCase() + names[i].slice(1).toLowerCase();
				}
				const name = names.join(' ');
				message.channel.send(name);
			});
	}
});

client.login(token);