const config = require('../config');
const fs = require('fs');

const terminalColors = {
    "reset": "\x1b[0m",
    "black": "\x1b[30m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "yellow": "\x1b[33m",
    "blue": "\x1b[34m",
    "magenta": "\x1b[35m",
    "cyan": "\x1b[36m",
    "white": "\x1b[37m",
}

function printFileLoaded(fileName, type) {
    console.log(`[${config.clientName}] (${terminalColors.green}${type.toUpperCase()}${terminalColors.reset}) File ${fileName} was loaded.`)
}

module.exports = (client) => {
    // Event Handler
    fs.readdir(`./src/events/`, (err, files) => {
        if (err) throw err;
        var jsFiles = files.filter(f => f.split(".").pop() === "js");
        if (jsFiles.length <= 0) return console.log(`[${config.clientName}] (${terminalColors.red}ERROR${terminalColors.reset}) No Events Found!`);

        jsFiles.forEach(file => {
            var fileGet = require(`${process.cwd()}/src/events/${file}`);
            try {
                client.events.set(fileGet.name, fileGet);
                printFileLoaded(file, 'event');
            } catch (err) {
                return console.log(err);
            }
        });
    });

    // Command Handler
    fs.readdirSync('./src/commands/').forEach(dir => {
        fs.readdir(`./src/commands/${dir}`, (err, files) => {
            if (err) throw err;
            var jsFiles = files.filter(f => f.split(".").pop() === "js");
            if (jsFiles.length <= 0) return console.log(`[${config.clientName}] (${terminalColors.red}ERROR${terminalColors.reset}) No Commands Found!`);

            jsFiles.forEach(file => {
                var fileGet = require(`${process.cwd()}/src/commands/${dir}/${file}`);
                try {
                    client.commands.set(fileGet.help.name, fileGet);
                    fileGet.help.aliases.forEach(alias => {
                        client.aliases.set(alias, fileGet.help.name);
                    })
                    printFileLoaded(file, 'command');
                } catch (err) {
                    return console.log(err);
                }
            });
        });
    });

    // Slash Command Handler
    fs.readdirSync('./src/slashCommands/').forEach(dir => {
        fs.readdir(`./src/slashCommands/${dir}`, (err, files) => {
            if (err) throw err;
            var jsFiles = files.filter(f => f.split(".").pop() === "js");
            if (jsFiles.length <= 0) return console.log(`[${config.clientName}] (${terminalColors.red}ERROR${terminalColors.reset}) No Slash Commands Found!`);

            jsFiles.forEach(file => {
                var fileGet = require(`${process.cwd()}/src/slashCommands/${dir}/${file}`);
                try {
                    client.slashCommands.set(fileGet.help.name, fileGet);
                    printFileLoaded(file, 'slash-command');
                } catch (err) {
                    return console.log(err);
                }
            });
        });
    });
};