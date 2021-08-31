module.exports.run = async (client, message, args, prefix) => {
    await message.channel.send({ content: `View all command by typing \`/\` and then clicking on our bot logo.` })
}

module.exports.help = {
    name: "help",
    aliases: ["commands"]
}