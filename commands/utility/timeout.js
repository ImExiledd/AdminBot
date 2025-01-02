const { SlashCommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js');

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
        .setDescription('The length of time to suspend the target in minutes.')
        .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('The reason you are timing out the user from chatting in this guild')
            .setRequired(false))
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers)
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const { client, guild } = interaction;
        const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') ?? 'No reason provided';
        const time = interaction.options.getInteger('duration')
        const guildName = guild.name
        client.users.fetch(user.id).then(user => {
            user.send(`You have been timed out in ${guildName}. Moderator message: ${reason}`)
        });
        const targetUser = await guild.members.fetch(user);
        setTimeout(function() {
                targetUser.timeout(time * 5 * 1000, reason);
        }, 2000);
        interaction.reply({
            content: `Successfully timed out ${user} for ${time} minutes! Reason: ${reason}`
        });
    },
}
