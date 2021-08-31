const { MessageActionRow, MessageButton, Permissions, MessageEmbed } = require('discord.js');
const config = require('../../config.json')

module.exports.run = async (client, message, args, prefix) => {
    const member = message.guild.members.cache.get(message.author.id);
    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ content: "You don't have permissions to execute this command." });

    await message.delete()

    const embed = new MessageEmbed()
        .setColor(0x0092E2)
        .setAuthor(`Select a Role.`, `${message.guild.iconURL()}`)
        .setDescription(`Choose every notification you want to enable.\nPress the buttons below to add or remove a role.`)
        .setFooter(config.embedFooter)

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("GiveRoleGeneral")
            .setLabel("General Updates")
            .setEmoji('🔥')
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("GiveRoleGiveaways")
            .setLabel("Giveaways")
            .setEmoji('🎉')
            .setStyle("PRIMARY"),
        new MessageButton()
            .setCustomId("GiveRoleCoinz")
            .setLabel("Coinz")
            .setEmoji('🪙')
            .setStyle("PRIMARY")
    )

    const msg = await message.channel.send({ embeds: [embed], components: [row] });
}

module.exports.help = {
    name: "rolesetup",
    aliases: []
}