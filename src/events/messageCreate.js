const client = require('../index').client;
const config = require('../config.json');

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;

    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    const args = message.content.substring(config.prefix.length).split(/ +/);

    let commands = client.commands.get(cmd.slice(config.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(config.prefix.length)));
    if (commands) commands.run(client, message, args, config.prefix);
});