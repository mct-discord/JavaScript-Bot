const Discord = require('discord.js');
const { getUser, getCourses } = require('../libs/canvas_api');

module.exports = {
	name: 'profile',
	description: 'Displays a small profile card',
	async execute(message, canvas_access_token) {
		const reply = await message.channel.send('Loading profile...');
		const user = await getUser(canvas_access_token);
		const profile = new Discord.RichEmbed()
			.setColor('#e85e00')
			.setAuthor(user.name, user.avatar_url)
			.addField('Courses', await getCourses(canvas_access_token));
		reply.delete();
		message.channel.send(profile);
	},
};