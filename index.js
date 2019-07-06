const Discord = require('discord.js');
const Keyv = require('keyv');
const { prefix, token, redis_connection_string } = require('./config.json');
const fetch = require('node-fetch');

const client = new Discord.Client();
const keyv = new Keyv(redis_connection_string);
keyv.on('error', err => console.error('Keyv connection error:', err));

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
	message.channel.send('WIP');
	if (command === 'courses') {
		const canvas_api_token = await keyv.get('canvas_api_token');
		message.channel.send(await getCourses(canvas_api_token));
	}
	else if (command === 'favorites') {
		const canvas_api_token = await keyv.get('canvas_api_token');
		message.channel.send(await getFavorites(canvas_api_token));
	}
	else if (command === 'name') {
		const canvas_api_token = await keyv.get('canvas_api_token');
		message.channel.send(await getName(canvas_api_token));
	}
	else if (command === 'profile') {
		const canvas_api_token = await keyv.get('canvas_api_token');
		const user = await getUser(canvas_api_token);
		const profile = new Discord.MessageEmbed()
			.setColor('#e85e00')
			.setAuthor(await getName(canvas_api_token), user.avatar_url)
			.addField('Courses', await getCourses(canvas_api_token));
		message.channel.send(profile);
	}
});

client.login(token);