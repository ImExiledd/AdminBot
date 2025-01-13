const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Test bot responsiveness'),
    async execute(interaction) {
        try {
            await interaction.reply("Pong!")
        } catch (error) {
            LOGGER.error("An error has occured in 'utility/ping.js': " + error)
            return 1
        }
    },
};