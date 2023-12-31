// Janky as all fuck, and based on some old ass shit I just had but it still works.
const fs = require('fs');
const path = require("path");

module.exports.run = async (client, message, args) => {
    if(message.author.id != client.config.owner) return message.react('❌');
    if(args.length < 3) return message.react('❌');
    switch(args[0]) {
        case "reload":
            try {
                if(!client.commands.has(args[2])) return message.react('❌');
                delete require.cache[require.resolve(`../../commands/${args[1]}/${args[2]}.js`)];
                client.commands.delete(args[2]);
                const command = require(`../../commands/${args[1]}/${args[2]}`);
                client.commands.set(command.help.name, command);
                console.log(`[internal] [O] command "${command.help.name}" loaded.`);
                message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
            break;
        case "load":
            if(client.commands.has(args[2])) return message.react('❌');
            try {
                const _command = require(`../../commands/${args[1]}/${args[2]}.js`);
                client.commands.set(_command.help.name, _command);
                console.log(`[internal] [O] command "${_command.help.name}" loaded.`);
                message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
            break;
        case "unload":
            try {
                if(!client.commands.has(args[2])) return message.react('❌');
                delete require.cache[require.resolve(`../../commands/${args[1]}/${args[2]}.js`)];
                client.commands.delete(args[2]);
                console.log(`[internal] [O] command "${args[2]}" unloaded.`);
                message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
            break;
    }
};

module.exports.help = {
    name: "command",
    description: "Command load/unload/reload.",
    category: "kernel",
    owner: true
};

