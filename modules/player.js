const {
    NoSubscriberBehavior,
    StreamType,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    entersState,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    joinVoiceChannel,
} = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

module.exports.load = async (client) => { 
    player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Play,
            maxMissedFrames: Math.round(5000 / 20),
        },
    });

    client.player = player;

    client.startPlayer = function () {
        var songs = fs.readdirSync("./songs").filter(file => file.endsWith(".mp3"));
        var x = songs[Math.floor(Math.random()*songs.length)];

        console.log(`[player] Song is: ${x}`);

        client.player.play(createAudioResource(path.join(path.resolve(`songs`, x))));
    };

    client.player.on('stateChange', (oldState, newState) => {
        if (newState.status === AudioPlayerStatus.Idle) {
            console.log(`[player] Song ended, picking new one.`);

            client.startPlayer();

            client.times_played = client.times_played + 1;
		console.log(client.times_played)
            client.db.set("times_played", client.times_played);
		client.updateStatus();
        };
    }); 

    client.startPlayer();
};

module.exports.connectToPreviousChannels = async (client) => {
    var e = Array.from(client.voice_connections.values());
    e.forEach(async(c)=> {
        var vc = client.channels.cache.get(c.vc_id);

        if(!vc) return client.voice_connections.delete(c.guild_id);

        const ch = await client.modules["player"].connectToChannel(vc);

        ch.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(ch, VoiceConnectionStatus.Signalling, 2_000),
                    entersState(ch, VoiceConnectionStatus.Connecting, 2_000),
                ]);
            } catch (error) {
                console.log("[player] Destroy connection, bot was disconnected for more than 2 seconds.");
                if(client.voice_connections.has(c.guild_id)) client.voice_connections.delete(c.guild_id);
                ch.destroy();
            }
        });

        ch.subscribe(client.player);
    });
};

module.exports.loadedTasks = async (client) => {
    client.modules["player"].connectToPreviousChannels(client);
};

module.exports.unload = async (client) => {
    var e = Array.from(client.voice_connections.values());

    e.forEach(async(c)=> {
        const cn = getVoiceConnection(c.guild_id);
        cn.destroy();
    });
    client.player = null;
    client.startPlayer = null;
};

module.exports.connectToChannel = async (channel) => {
	const connection = joinVoiceChannel({
		channelId: channel.id,
		guildId: channel.guild.id,
		adapterCreator: channel.guild.voiceAdapterCreator,
	});
	try {
		await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
		return connection;
	} catch (error) {
		connection.destroy();
		throw error;
	};
};

module.exports.info = {
    name: "player"
};
