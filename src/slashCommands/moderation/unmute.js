const { MessageEmbed, Permissions } = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (interaction) => {
    const member = interaction.options.getMember('member');

    if (!member.roles.cache.find(r => r.id === config.muteRole)) return interaction.reply({ content: 'This user is not muted.', ephemeral: true });

    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`[UNMUTE] ${member.user.username}`, `${member.user.avatarURL()}`)
        .setDescription(`• Moderator: <@${interaction.member.user.id}>`)

    try {
        let role = interaction.guild.roles.cache.find(r => r.id === config.muteRole);
        await member.roles.remove(role);
    } catch (err) {
        return console.log(err);
    }

    await interaction.reply({ embeds: [embed] });
}

module.exports.help = {
    name: "unmute",
    description: "Unmute a member.",
    options: [
        {
            name: 'member',
            type: 'USER',
            description: 'The member you want to unmute.',
            required: true
        }
    ],
    memberPermissions: [Permissions.FLAGS.MANAGE_ROLES]
}