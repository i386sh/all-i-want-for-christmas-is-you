const {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    getVoiceConnection,
    VoiceConnectionStatus,
    joinVoiceChannel,
} = require('@discordjs/voice');

module.exports.run = async (client, message, args) => {
    if(message.author.id != client.config.owner) return message.react('❌');
    var e = Array.from(client.voice_connections.values());

    e.forEach(async(c)=> {
        const cn = getVoiceConnection(c.guild_id);
        if(client.voice_connections.has(c.guild_id)) client.voice_connections.delete(c.guild_id);
        cn.destroy();
    });
    message.react('✅');
};

module.exports.help = {
    name: "disconnectall",
    description: "Disconnect on all servers.",
    category: "radio",
    owner: true
};

