const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = "h/"

client.on('connecting', () => {
    console.log("Connecting to Discord's Servers");
});

client.on('disconnected', () => {
    console.log("Disconnected from Discord's Servers");
});

client.on('ready', () => {
    console.log("Connected to Discord's Servers");
});

function commandIs(str, msg) {
    return msg.content.toLowerCase().startsWith(prefix + str);
}

client.on('message', async msg => {
    var args = msg.content.split(/[ ]+/);
    if (msg.author.id == client.user.id) return;
    // start ur shite here

    if (commandIs('ping', msg)) {
        const m = await msg.channel.send(":ping_pong: Pinging...");
        m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
    }

    if (commandIs('eval', msg)) {
        if (!msg.author.id == 189400912333111297) return;
        args.shift();
        words = args.join(/[ ]+/);
        eval(words);
    }
}); // end

client.login(config.token);