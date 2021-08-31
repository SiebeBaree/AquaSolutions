const { MessageEmbed, Permissions } = require('discord.js');

module.exports.run = async (interaction) => {
    const member = interaction.options.getMember('member');
    let reason = interaction.options.getString('reason');

    if (interaction.member == member) return interaction.reply({ content: 'You cannot ban yourself.', ephemeral: true });
    if (!reason) reason = "No Reason Provided.";

    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`[BAN] ${member.user.username}`, `${member.user.avatarURL()}`)
        .setDescription(`• Moderator: <@${interaction.member.user.id}>\n• Reason: ${reason}`)
        .setImage('https://c.tenor.com/jJuyU09YX3AAAAAd/thor-banhammer.gif')

    try {
        await member.ban({ days: 7, reason: reason });
    } catch (err) {
        return console.log(err);
    }

    await interaction.reply({ embeds: [embed] });
}

module.exports.help = {
    name: "ban",
    description: "Ban a member from the server.",
    options: [
        {
            name: 'member',
            type: 'USER',
            description: 'The member you want to ban.',
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason why you want to ban this member.',
            required: false
        }
    ],
    memberPermissions: [Permissions.FLAGS.BAN_MEMBERS]
}