const {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    joinVoiceChannel,
} = require('@discordjs/voice');

module.exports.run = async (client, message, args) => {
    console.log("[debug] Connecting to chat..");
    var vc = message.member.voice.channel;

    if(!vc) return message.channel.send("You're not in a VC.");
    if(!vc.joinable) return message.channel.send("I can't join your VC.");
    if(client.voice_connections.has(message.guild.id)) return message.channel.send("I'm already in there.");
    const c = await client.modules["player"].connectToChannel(vc);
    
    client.voice_connections.set(message.guild.id, {vc_id: message.member.voice.channel.id, guild_id: message.guild.id});

    c.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
        try {
            await Promise.race([
                entersState(c, VoiceConnectionStatus.Signalling, 2_000),
                entersState(c, VoiceConnectionStatus.Connecting, 2_000),
            ]);
        } catch (error) {
            console.log("[debug] Destroy connection, bot was disconnected for more than 5 seconds.")
            if(client.voice_connections.has(message.guild.id)) client.voice_connections.delete(message.guild.id);
            c.destroy();
        }
    });

    c.subscribe(client.player);
};

module.exports.help = {
    name: "beginpsychosis",
    description: "Start the torture.",
    category: "radio",
    owner: false
};

