const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, Attachment } = require('discord.js');
const { readdir, readdirSync , createWriteStream, unlink, existsSync} = require('node:fs');
const { join, extname } = require('node:path');
const { get } = require('node:https');
const { randomUUID } = require('crypto');
const { exists } = require('sander');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('upload-image')
    .setDescription('Add a picture to the bot!')
    .addAttachmentOption(option => 
        option.setName('file')
        .setDescription('File to add')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('category')
        .setDescription('Category to add the image to!')
        .addChoices(
            { name: "caption", value: "caption" },
            { name: "creampie", value: "creampie" },
            { name: "ecchi", value: "ecchi" },
            { name: "normal", value: "normie" },
            { name: "shota", value: "shota" },
            { name: "solo", value: "solo" },
            { name: "yuri", value: "yuri" },
            { name: "test", value: "test1" }
        )
        .setRequired(true)
    )
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const attached = interaction.options.getAttachment("file");
        const category = interaction.options.getString("category");
        const imageName = `${randomUUID()}.${extname(attached.name)}`;
        const folderName = join(__dirname, '..', 'fun', 'images', category);
        const fileToRetrieve = `${folderName}/${imageName}`;
        const file = createWriteStream(fileToRetrieve);
        if(existsSync(folderName)) {
            var request = await get(attached.url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close();
                    interaction.reply({
                        content: `Success! ${attached.url}\n Your image has been saved to "${category}"`,
                        ephemeral: true
                    });
                });
            }).on('error', function(err) {
                unlink(file);
                console.log(err);
            });
        } else {
            interaction.reply({
                content: `Failure! The category "${category}" does not exist!`,
                ephemeral: true
            });
        }

    },
};