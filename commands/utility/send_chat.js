const { SlashCommandBuilder, PermissionsBitField, InteractionContextType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Send a chat message')
    .addStringOption(option => 
        option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        try {
            const { client, guild } = interaction;
            const user = interaction.user.id;
            const toSend = interaction.options.getString('message');

            interaction.channel.send(`<@${user}> --> ${toSend}`);
            interaction.reply({
                content: "Message sent successfully!",
                ephemeral: true
            })
        } catch(e) {
            console.log(e)
        }
    }
}