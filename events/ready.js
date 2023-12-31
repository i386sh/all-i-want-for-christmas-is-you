const fs = require('fs');
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
const path = require('path');

module.exports.run = (client) => {
    console.log(`AIWFCBot started.`);
    client.user.setStatus("dnd");

    client.modules["player"].connectToPreviousChannels(client);
    client.updateStatus();
};

module.exports.info = {
    name: "ready"
};