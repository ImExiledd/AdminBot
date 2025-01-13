const { SlashCommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js');

module.exports = {
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
            client.users.fetch(user.id).then(user => {
                user.send(`You have been kicked from ${guildName}. Moderator message: ${reason}`)
            });
            setTimeout(function() {
                interaction.guild.members.kick(user);
            }, 2000);
            interaction.reply({
                content: `Successfully kicked ${user}! Reason: ${reason}`,
                ephemeral: true
            });
        } catch (error) {
            LOGGER.error("An error has occured in 'utility/kick.js': " + error)
            return 1
        }

    },
};