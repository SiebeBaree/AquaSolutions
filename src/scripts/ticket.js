const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const ticketSettings = require('../data/ticketSettings.json');
const ticketData = require('../data/ticketData.json');
const config = require('../config.json')

const zeroPad = (num, places) => String(num).padStart(places, '0');

module.exports.createTicket = async (interaction, reason = undefined) => {
    // check if member has ticket open
    let tickets = ticketData.tickets;

    for (const ticket of tickets) {
        if (ticket.ownerId == interaction.member.id) return await interaction.reply({ content: `:x: You already have a ticket.`, ephemeral: true });
    }

    // create channel
    const channel = await interaction.guild.channels.create(`ticket-${zeroPad(ticketSettings.ticketNumber, 4)}`, {
        type: "GUILD_TEXT",
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                allow: ['SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ATTACH_FILES', 'EMBED_LINKS', 'ADD_REACTIONS', 'USE_EXTERNAL_EMOJIS'],
                deny: ['VIEW_CHANNEL']
            },
            {
                id: interaction.member.id,
                allow: ['VIEW_CHANNEL']
            }
        ],
        parent: "881970558848352336"
    });

    // increment ticket number
    ticketSettings.ticketNumber++;
    fs.writeFile(`${process.cwd()}/src/data/ticketSettings.json`, JSON.stringify(ticketSettings, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });

    // send hidden text to channel
    await interaction.reply({ content: `Visit your ticket here: <#${channel.id}>`, ephemeral: true });

    // send embed in channel
    if (reason === undefined) reason = "No reason was given.";

    const embed = new MessageEmbed()
        .setColor(0x0092E2)
        .setAuthor(`Ticket`, `${interaction.guild.iconURL()}`)
        .setDescription(`Thank you for creating a ticket.We will answer you as soon as possible.\nDon't tag us as this will only slow down our repsonds.\n\n**Ticket Owner:** <@${interaction.member.id}>\n**Reason:** ${reason}`)
        .setThumbnail(`${interaction.member.user.avatarURL()}`)
        .setTimestamp()
        .setFooter(config.embedFooter)

    const ticketCloseRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketClose")
            .setLabel("Close Ticket")
            .setEmoji('🔒')
            .setStyle("SECONDARY")
    )

    const msg = await channel.send({ embeds: [embed], components: [ticketCloseRow] });

    // add channel to ticketData
    const newTicket = {
        "channelId": `${channel.id}`,
        "ownerId": `${interaction.member.id}`,
        "messageId": `${msg.id}`,
        "confirmMessageId": `0`
    }
    ticketData.tickets.push(newTicket);
    fs.writeFile(`${process.cwd()}/src/data/ticketData.json`, JSON.stringify(ticketData, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });
};

module.exports.closeTicket = async (interaction, cmd = false) => {
    // check if member is ticket owner or ticket staff
    let memberIsAuthorized = false;
    let alreadyClosing = false;
    let messageId;

    let tickets = ticketData.tickets;
    tickets.forEach(ticket => {
        if (interaction.member.id == ticket.ownerId || interaction.member.id == config.ticketRole) {
            messageId = ticket.messageId;
            memberIsAuthorized = true;
            if (ticket.confirmMessageId != '0') alreadyClosing = true;
        };
    });

    if (alreadyClosing) return await interaction.reply({ content: `Please use the above closing message.`, ephemeral: true });
    if (!memberIsAuthorized) return await interaction.reply({ content: `You don't have permission to close this ticket.`, ephemeral: true });

    // send embed in channel
    const embed = new MessageEmbed()
        .setColor(0xF84511)
        .setAuthor(`Closing Ticket`, `${interaction.guild.iconURL()}`)
        .setDescription(`Are you sure you want to close this ticket?`)
        .setTimestamp()
        .setFooter(config.embedFooter)

    const ticketCloseConfirmRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketCloseConfirmYes")
            .setLabel("Yes")
            .setStyle("SUCCESS"),
        new MessageButton()
            .setCustomId("ticketCloseConfirmNo")
            .setLabel("No")
            .setStyle("DANGER")
    )

    if (cmd) await interaction.reply({ content: `Closing this ticket...`, ephemeral: true });
    else interaction.deferUpdate();

    let message = await interaction.channel.send({ embeds: [embed], components: [ticketCloseConfirmRow] });

    // add confirmMessageId to ticketData
    let elementIndex = 0;
    ticketData.tickets.forEach(ticket => {
        if (interaction.channelId == ticket.channelId) {
            ticketData.tickets[elementIndex].confirmMessageId = `${message.id}`;
        };
        elementIndex++;
    });
    fs.writeFile(`${process.cwd()}/src/data/ticketData.json`, JSON.stringify(ticketData, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });

    // disable close ticket button
    const ticketCloseDisabledRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketClose")
            .setLabel("Close Ticket")
            .setEmoji('🔒')
            .setStyle("SECONDARY")
            .setDisabled(true)
    )

    const msg = await interaction.channel.messages.fetch(messageId);
    await msg.edit({ components: [ticketCloseDisabledRow] })
};

module.exports.confirmCloseTicket = async (interaction) => {
    // check if member is ticket owner or ticket staff
    let memberIsAuthorized = false;

    let tickets = ticketData.tickets;
    tickets.forEach(ticket => {
        if (interaction.member.id == ticket.ownerId || interaction.member.id == config.ticketRole) {
            memberIsAuthorized = true;
        };
    });

    if (!memberIsAuthorized) return interaction.reply({ content: `You don't have permission to close this ticket.`, ephemeral: true });

    // remove ticket from ticketData
    let elementIndex = 0;
    ticketData.tickets.forEach(ticket => {
        if (interaction.channelId == ticket.channelId) {
            ticketData.tickets.splice(elementIndex);
        };
        elementIndex++;
    });
    fs.writeFile(`${process.cwd()}/src/data/ticketData.json`, JSON.stringify(ticketData, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });

    // delete channel
    await interaction.channel.delete();
};

module.exports.confirmCancelTicket = async (interaction) => {
    // check if member is ticket owner or ticket staff
    let memberIsAuthorized = false;
    let messageId;
    let confirmMessageId = '0';

    let tickets = ticketData.tickets;
    tickets.forEach(ticket => {
        if (interaction.member.id == ticket.ownerId || interaction.member.id == config.ticketRole) {
            messageId = ticket.messageId;
            confirmMessageId = ticket.confirmMessageId;
            memberIsAuthorized = true;
        };
    });

    if (!memberIsAuthorized) return interaction.reply({ content: `You don't have permission to close this ticket.`, ephemeral: true });

    // check if confirm message exists
    if (confirmMessageId == '0') return interaction.reply({ content: `Oops something went wrong...` });

    // delete confirm message
    const confirmMsg = await interaction.channel.messages.fetch(confirmMessageId);
    await confirmMsg.delete();

    // reset confirmMessageId in ticketData
    let elementIndex = 0;
    ticketData.tickets.forEach(ticket => {
        if (interaction.channelId == ticket.channelId) {
            ticketData.tickets[elementIndex].confirmMessageId = `0`;
        };
        elementIndex++;
    });
    fs.writeFile(`${process.cwd()}/src/data/ticketData.json`, JSON.stringify(ticketData, null, 4), function writeJSON(err) {
        if (err) return console.log(err);
    });

    // enable close ticket button
    const ticketCloseEnabledRow = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("ticketClose")
            .setLabel("Close Ticket")
            .setEmoji('🔒')
            .setStyle("SECONDARY")
            .setDisabled(false)
    )

    const msg = await interaction.channel.messages.fetch(messageId);
    await msg.edit({ components: [ticketCloseEnabledRow] })
};