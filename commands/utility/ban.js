const { SlashCommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js');


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
            const guildName = guild.name
            client.users.fetch(user.id).then(user => {
                user.send(`You have been banned from ${guildName}. Moderator message: ${reason}`)
            });
            setTimeout(function() {
                interaction.guild.members.ban(user);
            }, 2000);
            interaction.reply({
                content: `Successfully banned ${user}! Reason: ${reason}`,
                ephemeral: true
            });
        } catch (error) {
            LOGGER.error("An error has occured in 'utility/ban.js': " + error)
            return 1
        }

    },
};