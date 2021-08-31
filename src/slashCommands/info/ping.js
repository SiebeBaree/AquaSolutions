const { msToTime } = require("../../scripts/time");

module.exports.run = async (interaction) => {
    await interaction.deferReply();
    const dateNow = parseInt(Date.now())
    await interaction.editReply({ content: `:ping_pong: **Ping:** ${interaction.client.ws.ping} ms\n:speech_balloon: **Responds Time:** ${dateNow - interaction.createdTimestamp} ms\n:white_check_mark: **Uptime:** ${msToTime(interaction.client.uptime)}` });
}

module.exports.help = {
    name: "ping",
    description: "Get the latency in milliseconds and the uptime of the bot.",
    options: [],
    memberPermissions: []
}