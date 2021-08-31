require('dotenv').config();
const { Client, Collection } = require('discord.js');
const config = require('./config.json');

const intents = [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_MESSAGES",
]
const client = new Client({ intents: intents });

client.commands = new Collection();
client.aliases = new Collection();
client.events = new Collection();
client.slashCommands = new Collection();

require("./handlers/index.js")(client);
module.exports.client = client;

client.login(process.env.TOKEN);