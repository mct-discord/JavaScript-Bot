const Discord = require('discord.js');
const config = require('../config.json');


module.exports.run = async (bot, message, args) => {
	if (args[0] === 'help') return message.channel.send(`Just do ${config.prefix} help instead`);

	if (args[0]) {
		let command = args[0];
		if (bot.commands.has(command)) {
			command = bot.commands.get(command);
			const SHembed = new Discord.RichEmbed()
				.setAuthor('TestBOT HELP', message.guild.iconURL)
				.setDescription(`The bot prefix is: ${config.prefix}
                \n\n**Command**${command.config.name}
                \n**Description:** ${command.config.description || 'No description'}
                \n**Usage:** ${command.config.usage || 'No Usage'}
                \n**Accesable by:** ${command.config.accesableby || 'Members'}
                \n**Aliasses:**${command.config.noalias || command.config.aliases}`);

			message.channel.send(SHembed);
		}
	}
	if (!args[0]) {
		message.delete();
		const embed = new Discord.RichEmbed()
			.setAuthor('help command!', message.guild.iconURL)
			.setDescription(`${message.author.username} check your DM's!`);

		const Sembed = new Discord.RichEmbed()
			.setAuthor('TestBOT HELP', message.guild.iconURL)
			.setThumbnail(bot.user.displayAvatarURL)
			.setTimestamp()
			.setDescription(`These are the available commands for the TestBOT!\n The bot prefix is ${config.prefix}`)
			.addField('Commands', '``courses`` ``favorites`` ``help`` ``name`` ``profile`` ``token``')
			.setFooter('TestBot', bot.user.displayAvatarURL);
		message.channel.send(embed).then(m => m.delete(10000));
		message.author.send(Sembed);
	}
};


module.exports.config = {
	name: 'help',
	aliases: ['h', 'halp', 'commands'],
	usage: '!usage',
	description: '',
	noalias: 'No Aliases',
	accesableby: 'Memeber',
};