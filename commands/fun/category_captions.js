const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, AttachmentBuilder, EmbedBuilder, Integration } = require('discord.js');
const { fs } = require('fs');
const { path } = require('path');
const { sander } = require('sander');
const { execSync, exec } = require("child_process");

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
    data: new SlashCommandBuilder()
    .setName('caption')
    .setDescription('Random caption!')
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const file = new AttachmentBuilder(getImage(`${__dirname}/images/captions`));
        interaction.reply({files: [file]});
    }
}