const { msToTime } = require("../../scripts/time");

module.exports.run = async (client, message, args, prefix) => {
    let msg = await message.reply({ content: `:radio_button: Calculating...` });
    await msg.edit({ content: `:ping_pong: **Ping:** ${client.ws.ping} ms\n:speech_balloon: **Responds Time:** ${msg.createdTimestamp - message.createdTimestamp} ms\n:white_check_mark: **Uptime:** ${msToTime(client.uptime)}` });
}

module.exports.help = {
    name: "ping",
    aliases: ["uptime"]
}