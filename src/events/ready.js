const client = require('../index').client;
const config = require('../config.json');
const { createSlashCommands } = require('../handlers/dataHandler')

client.once('ready', async () => {
    let guild = client.guilds.cache.get(config.guildId);
    client.channels.cache.get("881579479405850655").setName(`✨ Members: ${guild.memberCount}`);
    createSlashCommands(client);
    console.log(`[${config.clientName}] The bot has been loaded.`);
});