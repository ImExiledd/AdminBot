const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder } = require('discord.js');
const { adminChannelId } = require('../../config.json');

module.exports = {
    isGuildLimited: true,
    data: new SlashCommandBuilder()
    .setName('vent')
    .setDescription('Vent anonymously.')
    .addStringOption(option => 
        option.setName('message')
        .setDescription('The message to anonymously send')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.SendMessages)
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const { client, guild } = interaction;
        const guildName = guild.name;
        const ourUser = interaction.user.username;
        const ourUserPfp = interaction.user.avatarURL();
        const ourMessage = interaction.options.getString('message');
        try {
            const { client, guild } = interaction;
            const user = interaction.user.id;

            let anonMsg = await interaction.channel.send({content: `${ourMessage}`, fetchReply:true});
            const modEmbed = new EmbedBuilder()
            .setColor(0xE21D52)
            .setTitle(`Venting post from @${ourUser}`)
            .setAuthor({name:`${ourUser}`, iconURL: `${ourUserPfp}`})
            .setDescription(`User @${ourUser} vented anonymously. Message: ${anonMsg.url}`)
            .setThumbnail(ourUserPfp)
            .setTimestamp()
            .setFooter({ text:`Request sent by @${ourUser}` });
            interaction.reply({
                content: `Venting message sent successfully. Feel better soon! :pleading_face: (MSGID: ${anonMsg.id})`,
                ephemeral: true
            });
            client.channels.cache.get(adminChannelId).send({embeds:[modEmbed]});
        } catch(e) {
            console.log(e)
        }
    }
}