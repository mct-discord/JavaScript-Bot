const fetch = require('node-fetch');

module.exports = {
    name: 'token',
    description: 'Set your Canvas Access Token',
    async execute(message, args, canvas_access_tokens) {
        if (message.channel.type !== 'dm') {
            message.delete();
            await message.author.send('<@' + message.author.id + '> please do not send your Canvas Access Token in the discord server, send it here instead');
            return;
        }
        if (args.length === 0) {
			message.channel.send('Please specify a Canvas Access Token: ```!token <canvas_access_token>```');
            return;
        }
        const reply = await message.channel.send('Checking Canvas Access Token...');
        fetch('https://leho-howest.instructure.com/api/v1/users/self', {
            headers: {
                'Authorization': 'Bearer ' + args[0],
            },
        })
            .then(response => {
                if (response.status === 401) {
					reply.edit(':x: Invalid Canvas Access Token');
                    return;
                }
                canvas_access_tokens.set(message.author.id, args[0]);
                reply.edit(':white_check_mark: Saved Canvas Access Token');
            });
    },
};
