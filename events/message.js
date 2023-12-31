module.exports.run = async (client, message) => {
    if(message.author.bot) return;

    if(message.content.indexOf(client.config.prefix) !== 0) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = client.commands.get(args.shift().toLowerCase());

	if (!command) return;
    if (message.author.id != client.config.owner && command.help.owner == true) return message.react('❌');

    command.run(client, message, args);
};

module.exports.info = {
    name: "messageCreate"
};
