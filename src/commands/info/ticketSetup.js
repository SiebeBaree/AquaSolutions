const { MessageActionRow, MessageButton, Permissions, MessageEmbed } = require('discord.js');
const config = require('../../config.json')
const fs = require('fs');
const ticketSettings = require('../../data/ticketSettings.json')

module.exports.run = async (client, message, args, prefix) => {
    const member = message.guild.members.cache.get(message.author.id);
    if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return message.reply({ content: "You don't have permissions to execute this command." });

    await message.delete()

    const embed = new MessageEmbed()
        .setColor(0x0092E2)
        .setAuthor(`Create a Ticket`, `${message.guild.iconURL()}`)
        .setDescription(`Click on the button below to create a ticket.`)
        .setFooter(config.embedFooter)

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketCreate")
            .setLabel("Create a Ticket")
            .setStyle("PRIMARY")
    )

    const msg = await message.channel.send({ embeds: [embed], components: [row] });

    ticketSettings.channelId = msg.channelId;
    ticketSettings.messageId = msg.id;

    fs.writeFile(`${process.cwd()}/src/data/ticketSettings.json`, JSON.stringify(ticketSettings, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });
}

module.exports.help = {
    name: "setup",
    aliases: []
}