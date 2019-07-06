const Discord = require('discord.js');
const Keyv = require('keyv');
const { prefix, discord_api_token, redis_connection_string } = require('./config.json');
const fetch = require('node-fetch');

const client = new Discord.Client();
const canvas_api_tokens = new Keyv(redis_connection_string, { namespace: 'canvas_api_tokens' });
canvas_api_tokens.on('error', err => console.error('Keyv connection error:', err));

client.once('ready', () => {
	console.log('Ready!');
});

async function getCourses(canvas_api_token) {
	const courses = [];
	await fetch('https://leho-howest.instructure.com/api/v1/courses?access_token=' + canvas_api_token)
		.then(response => response.json())
		.then(json => {
			for (let i = 0; i < json.length; i++) {
				courses.push(json[i].name);
			}
		});
	return courses;
}

async function getFavorites(canvas_api_token) {
	const favorites = [];
	await fetch('https://leho-howest.instructure.com/api/v1/users/self/favorites/courses?access_token=' + canvas_api_token)
		.then(response => response.json())
		.then(json => {
			for (let i = 0; i < json.length; i++) {
				favorites.push(json[i].name);
			}
		});
	return favorites;
}

async function getName(canvas_api_token) {
	let name = '';
	await fetch('https://leho-howest.instructure.com/api/v1/users/self?access_token=' + canvas_api_token)
		.then(response => response.json())
		.then(json => {
			const names = json.name.split(' ');
			for (let i = 0; i < names.length; i++) {
				names[i] = names[i].charAt(0).toUpperCase() + names[i].slice(1).toLowerCase();
			}
			name = names.join(' ');
		});
	return name;
}

async function getUser(canvas_api_token) {
	let user = '';
	await fetch('https://leho-howest.instructure.com/api/v1/users/self?access_token=' + canvas_api_token)
		.then(response => user = response.json());
	return user;
}

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'token') {
		const reply = await message.channel.send('Checking Canvas api token...');
		if (!(await getUser(args[0])).name) {
			reply.edit('Invalid Canvas api token');
			return;
		}
		await canvas_api_tokens.set(message.author.id, args[0]);
		reply.edit('Canvas api token saved');
	}
	else {
		const canvas_api_token = await canvas_api_tokens.get(message.author.id);
		if (canvas_api_token === undefined) {
			message.channel.send('First tell me your canvas api token using: !token <canvas_api_token>');
			return;
		}
		if (command === 'courses') {
			message.channel.send(await getCourses(canvas_api_token));
		}
		else if (command === 'favorites') {
			message.channel.send(await getFavorites(canvas_api_token));
		}
		else if (command === 'name') {
			message.channel.send(await getName(canvas_api_token));
		}
		else if (command === 'profile') {
			const user = await getUser(canvas_api_token);
			const profile = new Discord.MessageEmbed()
				.setColor('#e85e00')
				.setAuthor(await getName(canvas_api_token), user.avatar_url)
				.addField('Courses', await getCourses(canvas_api_token));
			message.channel.send(profile);
		}
	}
});

client.login(discord_api_token);