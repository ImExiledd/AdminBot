const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, AttachmentBuilder, EmbedBuilder, Integration } = require('discord.js');
const { fs } = require('fs');
const { path } = require('path');
const { sander } = require('sander');
const { execSync, exec } = require("child_process");

// Command configuration, this is important
const isNsfw = true; // Is this a Not-Safe-For-Work command?

function getImage(dir) {
    const listCommand = `find ${dir}`;
    var indexOfFiles = 0;
    var ourImages = [];
    execSync(listCommand).toString(`utf-8`).split(/\r?\n/).forEach(file => {
        ourImages.push(file);
    });
    indexOfFiles -= 2;
    var randomImage = ourImages[Math.floor(Math.random()*ourImages.length)];
    return randomImage;
}

module.exports = {
    isGuildLimited: true,
    data: new SlashCommandBuilder()
    .setName('cunny')
    .setDescription('Random cunny lewd!')
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        try {
            const file = new AttachmentBuilder(getImage(`${__dirname}/images`));
            interaction.reply({ content:`Have some cunny~`, files: [file]});
        } catch(e) {
            interaction.reply({
                content: `This command errored! This is likely because the requested resource does not exist! (ERR: ${e})`,
                ephimeral: true
            });        
        }
    }
}