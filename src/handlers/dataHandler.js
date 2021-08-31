async function createSlashCommands(client) {
    var data = [];

    client.slashCommands.forEach(slashCommand => {
        let commandObject = {
            name: slashCommand.help.name,
            description: slashCommand.help.description,
            options: slashCommand.help.options
        };
        data.push(commandObject);
    });
    // await client.application?.commands.set(data);  // Used to set slash commands globally [Can take several hours to update.]
    await client.application?.commands.set([])
    await client.guilds.cache.get("739810780735602758")?.commands.set(data);
};

module.exports = { createSlashCommands };