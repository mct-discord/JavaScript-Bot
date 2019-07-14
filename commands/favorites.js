const { getFavorites } = require('../libs/canvas_api');

module.exports = {
	name: 'favorites',
	description: 'Gets your favorite courses',
	async execute(message, canvas_access_token) {
		message.channel.send(await getFavorites(canvas_access_token));
	},
};