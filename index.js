const Discord = require('discord.js');
const Keyv = require('keyv');
const { prefix, discord_api_token, redis_connection_string } = require('./config.json');
const fetch = require('node-fetch');
const parseLinkHeader = require('parse-link-header');

const client = new Discord.Client();
const canvas_access_tokens = new Keyv(redis_connection_string, { namespace: 'canvas_access_tokens' });
canvas_access_tokens.on('error', err => console.error('Keyv connection error:', err));

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('everybody 😶', { type: 'WATCHING' });
});

async function getCourses(canvas_access_token) {
	const courses = [];
	let next_url = 'https://leho-howest.instructure.com/api/v1/courses';
	while (next_url !== undefined) {
		await fetch(next_url, {
			headers: {
				'Authorization': 'Bearer ' + canvas_access_token,
			},
		})
			.then(response => {
				const next = parseLinkHeader(response.headers.get('Link')).next;
				if (next) {
					next_url = next.url + '&';
				}
				else {
					next_url = undefined;
				}
				return response.json();
			})
			.then(json => {
				for (let i = 0; i < json.length; i++) {
					courses.push(json[i].name);
				}
			});
	}
	return courses;
}

async function getFavorites(canvas_access_token) {
	const favorites = [];
	await fetch('https://leho-howest.instructure.com/api/v1/users/self/favorites/courses', {
		headers: {
			'Authorization': 'Bearer ' + canvas_access_token,
		},
	})
		.then(response => response.json())
		.then(json => {
			for (let i = 0; i < json.length; i++) {
				favorites.push(json[i].name);
			}
		});
	return favorites;
}

async function getName(canvas_access_token) {
	let name = '';
	await fetch('https://leho-howest.instructure.com/api/v1/users/self', {
		headers: {
			'Authorization': 'Bearer ' + canvas_access_token,
		},
	})
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

async function getUser(canvas_access_token) {
	let user = '';
	await fetch('https://leho-howest.instructure.com/api/v1/users/self', {
		headers: {
			'Authorization': 'Bearer ' + canvas_access_token,
		},
	})
		.then(response => user = response.json());
	return user;
}

client.on('message', async message => {
	console.log(message.content);
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (command === 'token') {
		const reply = await message.channel.send('Checking Canvas Access Token...');
		if (!(await getUser(args[0])).name) {
			reply.edit(':x: Invalid Canvas Access Token');
			return;
		}
		await canvas_access_tokens.set(message.author.id, args[0]);
		reply.edit(':white_check_mark: Saved Canvas Access Token');
		return;
	}
	else {
		const canvas_access_token = await canvas_access_tokens.get(message.author.id);
		if (canvas_access_token === undefined) {
			message.channel.send('First tell me your Canvas Access Token using: ```!token <canvas_access_token>```');
			return;
		}
		if (command === 'courses') {
			message.channel.send(await getCourses(canvas_access_token));
			return;
		}
		if (command === 'favorites') {
			message.channel.send(await getFavorites(canvas_access_token));
			return;
		}
		if (command === 'name') {
			message.channel.send(await getName(canvas_access_token));
			return;
		}
		if (command === 'profile') {
			const reply = await message.channel.send('Loading profile...');
			const user = await getUser(canvas_access_token);
			const profile = new Discord.MessageEmbed()
				.setColor('#e85e00')
				.setAuthor(await getName(canvas_access_token), user.avatar_url)
				.addField('Courses', await getCourses(canvas_access_token));
			reply.delete();
			message.channel.send(profile);
			return;
		}
	}
});

client.login(discord_api_token);