const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder } = require('discord.js');
const { adminChannelId } = require('../../config.json');

module.exports = {
    isGuildLimited: false,
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the guild')
    .addMentionableOption(option => 
        option.setName('target')
        .setDescription('Member to kick')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('reason')
        .setDescription('The reason you are kicking the target from the guild.')
        .setRequired(false)
    )      
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
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
            .setDescription(`User @${user.username} was kicked from the guild! Reason: ${reason}`)
			.setThumbnail(userPFP)
            .setTimestamp()
            .setFooter({ text:`Request sent by @${banIssuer}` });

            client.users.fetch(user.id).then(user => {
                user.send(`You have been kicked from ${guildName}. Moderator message: ${reason}`)
            });
            setTimeout(function() {
                //interaction.guild.members.kick(user);
            }, 2000);
            interaction.reply({
                content: `Successfully kicked ${user}! Reason: ${reason}`,
                ephemeral: true
            });
            client.channels.cache.get(adminChannelId).send({embeds:[modEmbed]});
        } catch (error) {
            console.log("An error has occured in 'utility/kick.js': " + error)
            return 1
        }

    },
};