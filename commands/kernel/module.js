const fs = require('fs');
const path = require("path");
module.exports.run = async (client, message, args) => {
    if(message.author.id != client.config.owner) return message.react('❌');
    if(args.length < 2) return message.react('❌');
    switch(args[0]) {
        case "reload":
            if(client.modules[args[1]] == null) return message.react('❌');
            try {
                client.modules[args[1]].unload(client);
                client.modules[args[1]] = null;
                delete require.cache[require.resolve(`../../modules/${args[1]}.js`)];
                const mod = require(`../../modules/${args[1]}.js`);
                mod.load(client);
                client.modules[args[1]] = mod;
                mod.loadedTasks(client);
                console.log(`[internal] [O] command "${command.help.name}" reloaded.`);
                message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
            break;
        case "load":
            if(client.modules[args[1]]) return message.react('❌');
            try {
                const _mod = require(`../../modules/${args[1]}.js`);
                _mod.load(client);
                client.modules[args[1]] = _mod;
                _mod.loadedTasks(client);
                console.log(`[internal] [O] command "${command.help.name}" loaded.`);
                message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
            break;
        case "unload":
            if(client.modules[args[1]] == null) return message.react('❌');
            try {
                delete require.cache[require.resolve(`../../modules/${args[1]}.js`)];
                client.modules[args[1]].unload(client);
                client.modules[args[1]] = null;
                console.log(`[internal] [O] command "${command.help.name}" unloaded.`);
                message.react('✅');
            } catch (e) {
                return message.react('❌');
            }
            break;
    }
};

module.exports.help = {
    name: "module",
    description: "Module load/unload/reload.",
    category: "kernel",
    owner: true
};

