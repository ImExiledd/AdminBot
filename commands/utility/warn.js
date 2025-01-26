const { SlashCommandBuilder, PermissionsBitField, InteractionContextType, EmbedBuilder } = require('discord.js');
const { adminChannelId, timeoutOnMaxWarnings, maxWarningTimeoutDurationInHours, maxWarnings } = require('../../config.json');
const { randomUUID } = require('crypto');
const Users = require('../../models/Users');

module.exports = {
    isGuildLimited: false,
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to guild member.')
    .addMentionableOption(option => 
        option.setName('target')
        .setDescription('The guild member to issue the warning to')
        .setRequired(true))
    .addStringOption(option => 
        option.setName('reason')
        .setDescription('The reason you are warning this guild member.')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
    .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        /* This command exists to provide a warning system to users within your Discord guild.
        * This will serve as an intro to databases for us. */
        const targetUser = interaction.options.getUser("target");
        const targetUserId = targetUser.id.toString();
        const warnReason = interaction.options.getString("reason") ?? "No reason provided.";
        const banIssuer = interaction.user.username;
        const banIssuerPFP = interaction.user.avatarURL();
        const userPFP = targetUser.avatarURL();

        const { client, guild } = interaction;
        const query = {
            id: targetUserId,
        };
        try {
            const userId = await Users.findOne(query);
            if(userId) {
                userId.warnsIssued += 1;
                interaction.reply({
                    content: `Warning issued to <@${targetUserId}>`,
                    ephemeral: true
                });
                const modEmbed = new EmbedBuilder()
                .setColor(0xd4cb05)
                .setTitle(`Warning issued against @${targetUser.username}`)
                .setAuthor({name:`${banIssuer}`, iconURL: `${banIssuerPFP}`})
                .setDescription(`User @${targetUser.username} was warned! Reason: ${warnReason}\n***(Warning #${userId.warnsIssued})***`)
                .setThumbnail(userPFP)
                .setTimestamp()
                .setFooter({ text:`Request sent by @${banIssuer}` });
                setTimeout(function() {
                    client.users.fetch(targetUserId).then(user => {
                        if(timeoutOnMaxWarnings === true) {
                            if(userId.warnsIssued >= maxWarnings) {
                                user.send(`You have been issued a warning in ${guild.name}! Reason: ${warnReason}`);
                                client.channels.cache.get(adminChannelId).send({embeds:[modEmbed]});
                                const userToSuspend = guild.members.fetch(targetUser);
                                userToSuspend.timeout(maxWarningTimeoutDurationInHours * 5 * 1000, `${warnReason} - Max warnings reached, automatic punishment.`)

                            }
                        } else {
                            user.send(`You have been issued a warning in ${guild.name}! Reason: ${warnReason}`);
                            client.channels.cache.get(adminChannelId).send({embeds:[modEmbed]});
                        }

                    });
                }, 1500);
                await userId.save().catch(e => {
                    console.log(`Error saving userWarn to database: ${e}`);
                    return;
                });
            }
            // If not userWarns
            else {
                const newUser = new Users({
                    id: targetUser.id,
                    warnsIssued: 1,
                    recoveryKey: `${randomUUID()}`,
                    recoveryKeyVoid: 0
                });
                await newUser.save()
            }
        } catch(error) {
            console.log("DB error occured: " + error);
        }
    }
}