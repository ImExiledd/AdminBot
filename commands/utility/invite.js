const { SlashCommandBuilder } = require('discord.js');
const { clientId } = require('../../config.json');

module.exports = {
    isGuildLimited: false,
    data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite Lillith to another server!"),
    async execute(interaction) {
        interaction.reply({
            content: `Hey! Glad you're enjoying Lillith!\nYou can invite me by clicking [this link](https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=581773184724167&integration_type=0&scope=bot)!\n(Plaintext invite link: https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=581773184724167&integration_type=0&scope=bot)`,
            ephemeral: true
        });
    }
}