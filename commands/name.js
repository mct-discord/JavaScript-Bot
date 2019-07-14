const { getUser } = require('../libs/canvas_api');

module.exports = {
	name: 'name',
	description: 'Gets your Canvas name',
	async execute(message, canvas_access_token) {
		message.channel.send((await getUser(canvas_access_token)).name);
	},
};