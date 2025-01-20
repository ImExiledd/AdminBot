const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder } = require('discord.js');
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
			const senderName = interaction.user.username;
			const reason = interaction.options.getString('reason') ?? "No reason provided.";
			const guildName = guild.name;
			const userAvatar = interaction.user.avatarURL();

			const alertEmbed = new EmbedBuilder()
            .setColor(0xE21D52)
            .setTitle("Admin Alerter")
            .setDescription(`${reason}`)
			.setThumbnail(userAvatar)
            .setTimestamp()
            .setFooter({ text:`Request sent by @${senderName}` });

			interaction.reply({
			 	content: "Request successful, a message has been sent to staff.",
			 	ephemeral: true
			});
			client.channels.cache.get(adminChannelId).send({embeds:[alertEmbed]});
		} catch(error) {
			console.log("An error has occured in 'utility/alert.js': " + error);
			return "error";
		}
	}
}