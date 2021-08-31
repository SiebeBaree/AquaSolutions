const { MessageEmbed, Permissions } = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (interaction) => {
    const member = interaction.options.getMember('member');
    let reason = interaction.options.getString('reason');

    if (interaction.member == member) return interaction.reply({ content: 'You cannot mute yourself.', ephemeral: true });
    if (!reason) reason = "No Reason Provided.";

    if (member.roles.cache.find(r => r.id === config.muteRole)) return interaction.reply({ content: 'This user is already muted.', ephemeral: true });

    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`[MUTE] ${member.user.username}`, `${member.user.avatarURL()}`)
        .setDescription(`• Moderator: <@${interaction.member.user.id}>\n• Reason: ${reason}`)

    try {
        let role = interaction.guild.roles.cache.find(r => r.id === config.muteRole);
        await member.roles.add(role);
    } catch (err) {
        return console.log(err);
    }

    await interaction.reply({ embeds: [embed] });
}

module.exports.help = {
    name: "mute",
    description: "Mute a member of this server.",
    options: [
        {
            name: 'member',
            type: 'USER',
            description: 'The member you want to mute.',
            required: true
        },
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason why you want to mute this member.',
            required: false
        }
    ],
    memberPermissions: [Permissions.FLAGS.MANAGE_ROLES]
}