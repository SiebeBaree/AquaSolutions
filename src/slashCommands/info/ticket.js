const { createTicket } = require('../../scripts/ticket');

module.exports.run = async (interaction) => {
    let reason = interaction.options.getString('reason');
    if (!reason) reason = "No reason provided.";
    createTicket(interaction, reason);
}

module.exports.help = {
    name: "ticket",
    description: "Create a ticket.",
    options: [
        {
            name: 'reason',
            type: 'STRING',
            description: 'The reason of creating this ticket.',
            required: false
        }
    ],
    memberPermissions: []
}