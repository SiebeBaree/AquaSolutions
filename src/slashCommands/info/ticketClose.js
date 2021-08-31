const { closeTicket } = require('../../scripts/ticket');
const ticketData = require('../../data/ticketData.json');

module.exports.run = async (interaction) => {
    let inTicketChannel = false;

    let tickets = ticketData.tickets;
    tickets.forEach(ticket => {
        if (interaction.channelId == ticket.channelId) inTicketChannel = true;
    });

    if (inTicketChannel) closeTicket(interaction, true);
    else await interaction.reply({ content: `You have to be in a ticket to use this command.`, ephemeral: true });
}

module.exports.help = {
    name: "close",
    description: "Close a ticket.",
    options: [],
    memberPermissions: []
}