const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Test bot responsiveness')
    .catch(error => {
        console.log(`ERROR!!!: ${error}`)
    }),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
};