const { MessageEmbed, Permissions } = require('discord.js');

module.exports.run = async (interaction) => {
    const member = interaction.options.getMember('member');
    let reason = interaction.options.getString('reason');

    if (interaction.member == member) return interaction.reply({ content: 'You cannot kick yourself.', ephemeral: true });
    if (!reason) reason = "No Reason Provided.";

    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`[KICK] ${member.user.username}`, `${member.user.avatarURL()}`)
        .setDescription(`• Moderator: <@${interaction.member.user.id}>\n• Reason: ${reason}`)

    try {
        await member.kick({ reason: reason });

    } catch (err) {
        return console.log(err);
    }

    await interaction.reply({ embeds: [embed] });
}

module.exports.help = {
    name: "kick",
    description: "Kick someone from this server.",
    options: [
        {
            name: 'member',
            type: 'USER',
            description: 'The member you want to kick.',
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason why you want to kick this member.',
            required: false
        }
    ],
    memberPermissions: [Permissions.FLAGS.KICK_MEMBERS]
}