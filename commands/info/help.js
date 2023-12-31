module.exports.run = async (client, message, args) => {
    var final = "```";
    client.commands.map((c) => {
        if(message.author.id != client.config.owner && c.help.owner == true) return;
        final += `\n${client.config.prefix}${c.help.name} - ${c.help.description}`;
    });
    message.channel.send(`${final}\`\`\``);
};

module.exports.help = {
    name: "help",
    description: "Nobody can help you now.. except this command... I hope..",
    category: "info",
    owner: false
};

