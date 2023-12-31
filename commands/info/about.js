module.exports.run = async (client, message, args) => {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
message.channel.send(`\`\`\`- AIWFCBot -
Uptime: ${days}d ${hours}h ${minutes}m ${seconds}s
Modules loaded: ${Object.keys(client.modules).join(", ")}.
\`\`\``)
};

module.exports.help = {
    name: "about",
    description: "Information about the bot?",
    category: "info",
    owner: false
};

