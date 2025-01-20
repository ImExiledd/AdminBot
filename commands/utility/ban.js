const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder } = require('discord.js');
const { adminChannelId } = require('../../config.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the guild')
    .addMentionableOption(option => 
        option.setName('target')
        .setDescription('Ban a member from the guild')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('reason')
        .setDescription('The reason you are banning the user from this guild')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        try {
            const { client, guild } = interaction;
            const user = interaction.options.getUser('target');
            const reason = interaction.options.getString('reason') ?? 'No reason provided';
            const guildName = guild.name;
            const banIssuer = interaction.user.username;
            const banIssuerPFP = interaction.user.avatarURL();
            const userPFP = user.avatarURL();

            const modEmbed = new EmbedBuilder()
            .setColor(0xE21D52)
            .setTitle(`Moderation taken against @${user.username}`)
            .setAuthor({name:`${banIssuer}`, iconURL: `${banIssuerPFP}`})
            .setDescription(`User @${user.username} was permanently banned! Reason: ${reason}`)
			.setThumbnail(userPFP)
            .setTimestamp()
            .setFooter({ text:`Request sent by @${banIssuer}` });

            client.users.fetch(user.id).then(user => {
                user.send(`You have been banned from ${guildName}. Moderator message: ${reason}`);
            });
            setTimeout(function() {
                interaction.guild.members.ban(user);
            }, 2000);
            interaction.reply({
                content: `Successfully banned ${user}! Reason: ${reason}`,
                ephemeral: true
            });
            client.channels.cache.get(adminChannelId).send({embeds:[modEmbed]});
        } catch (error) {
            console.log("An error has occured in 'utility/ban.js': " + error);
            return 1;
        }

    },
};