const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, Attachment, EmbedBuilder } = require('discord.js');
const { readdir, readdirSync , createWriteStream, unlink, existsSync} = require('node:fs');
const { join, extname } = require('node:path');
const { get } = require('node:https');
const { randomUUID } = require('crypto');
const { exists } = require('sander');
const { nsfwImageChannelId } = require('../../config.json');

module.exports = {
    isGuildLimited: true,
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
        )
        .setRequired(true)
    )
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const attached = interaction.options.getAttachment("file");
        const category = interaction.options.getString("category");
        const imageAuthor = interaction.user.username();
        const imageAuthorPFP = interaction.user.avatarURL();
        const imageName = `${randomUUID()}.${extname(attached.name)}`;
        const folderName = join(__dirname, '..', 'fun', 'images', category);
        const fileToRetrieve = `${folderName}/${imageName}`;
        const file = createWriteStream(fileToRetrieve);
        const uploadEmbed = new EmbedBuilder()
        .setColor(0x099FF)
        .setTitle("New Image!")
        .setAuthor({name: `${imageAuthor}`, iconURL: `${banIssuerPFP}`})
        .setThumbnail(attached.url)
        .setDescription(`Image successfully uploaded into ${category}`)
        .setTimestamp()
        .setFooter({ text:`Uploaded by ${imageAuthor}` });
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
            client.channels.cache.get(nsfwImageChannelId).send({embeds:[modEmbed]});
        } else {
            interaction.reply({
                content: `Failure! The category "${category}" does not exist!`,
                ephemeral: true
            });
        }

    },
};