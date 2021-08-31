const { MessageEmbed, Permissions } = require('discord.js');

module.exports.run = async (interaction) => {
    const member = interaction.options.getString('member');

    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`[UNBAN] ${member}`, `https://cdn.discordapp.com/embed/avatars/0.png`)
        .setDescription(`• Moderator: <@${interaction.member.user.id}>`)

    try {
        await interaction.guild.members.unban(member);
    } catch {
        return interaction.reply({ content: `This user is not banned.`, ephemeral: true });
    }

    await interaction.reply({ embeds: [embed] });
}

module.exports.help = {
    name: "unban",
    description: "Unban a member.",
    options: [
        {
            name: 'member',
            type: 'STRING',
            description: 'The member you want to unban.',
            required: true
        }
    ],
    memberPermissions: [Permissions.FLAGS.BAN_MEMBERS]
}