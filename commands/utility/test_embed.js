// delete this later

const {SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test')
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x099FF)
            .setTitle("Example Embed Title")
            .setAuthor({name: "Test Embed User"})
            .setDescription("Test embed description")
            .addFields(
                { name: "Field 1 Name", value: "Field 1 value"}
            )
            .addFields({ name: "Inline Field 1 Name", value: "Inline Field 1 Value", inline: true})
            .setTimestamp()
            .setFooter({ text:"Test footer text", });
        interaction.reply({embeds: [exampleEmbed]});
    }
}