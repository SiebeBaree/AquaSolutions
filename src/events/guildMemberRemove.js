const { MessageEmbed } = require('discord.js');
const client = require('../index').client;
const config = require('../config.json');

client.on('guildMemberRemove', async (member) => {
    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`${member.user.tag} (${member.id})`, `${member.user.avatarURL()}`)
        .setDescription(`• Username: <@${member.id}> (${member.id})\n• Created: <t:${parseInt(member.user.createdTimestamp / 1000)}:F> (<t:${parseInt(member.user.createdTimestamp / 1000)}:R>)\n• Joined: <t:${parseInt(member.joinedTimestamp / 1000)}:F> (<t:${parseInt(member.joinedTimestamp / 1000)}:R>)\n• Left: <t:${parseInt(Date.now() / 1000)}:F> (<t:${parseInt(Date.now() / 1000)}:R>)`)
        .setFooter(config.embedFooter)
        .setTimestamp()

    await client.channels.cache.get(config.memberChannel).send({ embeds: [embed] });

    let guild = client.guilds.cache.get(config.guildId);
    client.channels.cache.get("881579479405850655").setName(`✨ Members: ${guild.memberCount}`);
});