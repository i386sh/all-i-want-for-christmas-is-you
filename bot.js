/*
I _fucking_ hate myself.
*/

console.log(`[internal] started.`)

const Discord = require("discord.js"),
	  config = require("./config.json"),
	  prism = require("prism-media"),
	  fs = require("fs"),
	  Enmap = require("enmap"),
	  path = require("path");

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

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES","GUILD_MEMBERS", "GUILD_VOICE_STATES"] });

client.commands = new Discord.Collection();

client.modules = {};

client.voice_connections = new Enmap({ name: "voice_connections" });

client.db = new Enmap({ name: "bot_database" });

client.config = config;
client.times_played = parseInt(client.db.get("times_played")) || 0;

client.updateStatus = function () {
	client.user.setActivity(`${config.status.replace(`{prefix}`, config.prefix).replace(`{count}`, client.times_played)}`);
};

fs.readdir("./modules", (err, files) => {
	for (const m of files) {
		if(!m.endsWith(".js")) return;
		const module = require(`./modules/${m}`);
		module.load(client);
		client.modules[module.info.name] = module;
		console.log(`[internal] module "${module.info.name}" loaded.`);

	};
});

fs.readdir("./commands", (err, files) => {
	for (const m of files) {
		fs.readdir(`./commands/${m}`, (err, _files) => {
			for (const c of _files) {
				const command = require(`./commands/${m}/${c}`);
				client.commands.set(command.help.name, command);

				console.log(`[internal] command "${command.help.name}" loaded.`);
			};
		});
	};
});

fs.readdir("./events", (err, files) => {
	for (const m of files) {
		if(!m.endsWith(".js")) return;
		const event = require(`./events/${m}`);
		client.on(event.info.name, event.run.bind(null, client));
		console.log(`[internal] event "${event.info.name}" loaded.`);
	};
});

client.login(config.token)
