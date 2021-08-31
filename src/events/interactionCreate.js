const client = require('../index').client;
const ticket = require('../scripts/ticket');
const role = require('../scripts/role');

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        // await interaction.deferReply({ ephemeral: false }).catch(() => { });

        let slashCommand = client.slashCommands.get(interaction.commandName);
        if (!interaction.member.permissions.has(slashCommand.help.memberPermissions)) return interaction.reply({ content: "You don't have permissions to execute this command.", ephemeral: true });
        if (slashCommand) slashCommand.run(interaction);
    } else if (interaction.isButton()) {
        if (interaction.customId === 'ticketCreate') {
            ticket.createTicket(interaction);
        } else if (interaction.customId === 'ticketClose') {
            ticket.closeTicket(interaction);
        } else if (interaction.customId === 'ticketCloseConfirmYes') {
            ticket.confirmCloseTicket(interaction);
        } else if (interaction.customId === 'ticketCloseConfirmNo') {
            ticket.confirmCancelTicket(interaction);
        } else if (interaction.customId === 'GiveRoleGeneral') {
            const roleId = '';
            const userAlreadyHasRole = await role.checkRole(interaction, roleId);

            if (userAlreadyHasRole) {
                role.takeRole(interaction, roleId);
            } else {
                role.giveRole(interaction, roleId);
            }
            interaction.deferUpdate();
        } else if (interaction.customId === 'GiveRoleGiveaways') {
            const roleId = '';
            const userAlreadyHasRole = await role.checkRole(interaction, roleId);

            if (userAlreadyHasRole) {
                role.takeRole(interaction, roleId);
            } else {
                role.giveRole(interaction, roleId);
            }
            interaction.deferUpdate();
        } else if (interaction.customId === 'GiveRoleCoinz') {
            const roleId = '';
            const userAlreadyHasRole = await role.checkRole(interaction, roleId);

            if (userAlreadyHasRole) {
                role.takeRole(interaction, roleId);
            } else {
                role.giveRole(interaction, roleId);
            }
            interaction.deferUpdate();
        } else {
            await interaction.reply({ content: `Sorry, I don't know what to do with this button.`, ephemeral: true })
        }
    }
});