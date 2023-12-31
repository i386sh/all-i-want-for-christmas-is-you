// This exists because of debug purposes. Don't use it if you don't need to.
module.exports.run = async (client, message, args) => {
    if(message.author.id != client.config.owner) return message.react('❌');
    if(!args[0]) return;
    client.times_played = parseInt(args[0]);
    client.db.set("times_played", client.times_played);
    client.updateStatus();
    message.react('✅');
};

module.exports.help = {
    name: "set",
    description: "Set the loop count.",
    category: "radio",
    owner: true
};

