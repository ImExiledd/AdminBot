const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder } = require('discord.js');
const { adminChannelId } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Suspend a user without kicking or banning them')
    .addMentionableOption(option => 
        option.setName('target')
        .setDescription('Target guild member')
        .setRequired(true))
    .addIntegerOption(option =>
        option.setName('duration')
        .setDescription('The length of time to suspend the target in seconds.')
        .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('The reason you are timing out the user from chatting in this guild')
            .setRequired(false))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        try {
            const { client, guild } = interaction;
            const user = interaction.options.getUser('target');
            const reason = interaction.options.getString('reason') ?? 'No reason provided';
            const time = interaction.options.getInteger('duration')
            const guildName = guild.name
            const banIssuer = interaction.user.username;
            const banIssuerPFP = interaction.user.avatarURL();
            const userPFP = user.avatarURL();
            const modEmbed = new EmbedBuilder()
            .setColor(0xd4cb05)
            .setTitle(`Moderation taken against @${user.username}`)
            .setAuthor({name:`${banIssuer}`, iconURL: `${banIssuerPFP}`})
            .setDescription(`User @${user.username} was timed out from the guild for ${time} seconds! Reason: ${reason}`)
			.setThumbnail(userPFP)
            .setTimestamp()
            .setFooter({ text:`Request sent by @${banIssuer}` });
            client.users.fetch(user.id).then(user => {
                user.send(`You have been timed out in ${guildName}. Moderator message: ${reason}`)
            });
            const targetUser = await guild.members.fetch(user);
            setTimeout(function() {
                    targetUser.timeout(time * 1000, reason);
            }, 2000);
            interaction.reply({
                content: `Successfully timed out ${user} for ${time} secpnds! Reason: ${reason}`
            });
            client.channels.cache.get(adminChannelId).send({embeds:[modEmbed]});
        } catch (error) {
            console.log("An error has occured in 'utility/timeout.js': " + error)
            return 1
        }
    },
}
