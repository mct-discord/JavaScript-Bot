const { getCourses } = require('../libs/canvas_api');

module.exports = {
	name: 'courses',
	description: 'Gets your courses',
	async execute(message, canvas_access_token) {
		message.channel.send(await getCourses(canvas_access_token));
	},
};