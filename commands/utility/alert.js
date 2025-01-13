const { SlashCommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js');
const { adminChannelId, adminRole } = require('../../config.json');
const { LOGGER } = require(`../../logging.js`);

module.exports = {
	data: new SlashCommandBuilder()
	.setName('alert')
	.setDescription('Quietly alert Admins and Moderators to a situation in a channel.')
	.addStringOption(option => 
		option.setName('reason')
		.setDescription('The reason for which you are requesting admin/mod help')
		.setRequired(false)
	)
	.setContexts(InteractionContextType.Guild),
	async execute(interaction) {
		try {
			const {client, guild, channel} = interaction;
			const sender = interaction.user.id;
			const reason = interaction.options.getString('reason');
			const guildName = guild.name;

			 client.channels.cache.get(adminChannelId).send(`||[<@&${adminRole}>]|| ALERT! User <@${sender}> ran the alert command in <#${channel.id}>! Reason: ${reason}`)
			 interaction.reply({
			 	content: "Request successful, a message has been sent to staff.",
			 	ephemeral: true
			 })
		} catch(error) {
			LOGGER.error("An error has occured in 'utility/alert.js': " + error);
			return "error";
		}
	}
}