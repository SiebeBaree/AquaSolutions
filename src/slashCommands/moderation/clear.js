const { Permissions } = require('discord.js');

module.exports.run = async (interaction) => {
    const amount = interaction.options.getInteger('amount');

    if (amount > 100) return interaction.reply({ content: 'You cannot delete more than 100 messages.', ephemeral: true });

    try {
        await interaction.channel.bulkDelete(amount);
    } catch (err) {
        console.log("Messages older than 14 days.");
    } finally {
        await interaction.reply({ content: `Cleared ${amount} messages.`, ephemeral: true });
    }

}

module.exports.help = {
    name: "clear",
    description: "Clear a number of messages form a channel.",
    options: [
        {
            name: 'amount',
            type: 'INTEGER',
            description: 'The amount of messages you want to clear.',
            required: true
        }
    ],
    memberPermissions: [Permissions.FLAGS.MANAGE_MESSAGES]
}