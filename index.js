const Discord = require('discord.js');
const ytdlInfo = require('ytdl-getinfo');
const ytdl = require('ytdl-core');
const config = require('./config.json');
const client = new Discord.Client();
const prefix = "h/"
var temp = {};

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

async function play(connection, id) {
    const queue = temp[id];
    // const stream = ytdl(queue.queue[0], {volume:0.5,filter:'audioonly'});
    // queue.dispatcher = await connection.playStream(ytdl(queue.queue[0], {volume:0.5,quality:[128,127,120,96,95,94,93]}), {seek:0,volume:0.5});
    queue.dispatcher = await connection.playStream(queue.queue[0], {seek:0,volume:0.5});
    queue.queue.shift();
    queue.name.shift();
    queue.dispatcher.on('end', function() {
        if (queue.queue) play(connection, id);
        else queue.dispatcher = null;
    });
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

    if (commandIs('play', msg)) {
        if (!msg.member.voiceChannel) {
            msg.channel.send("You're not in a voice channel");
            return;
        }
        if (!msg.member.voiceChannel.joinable) {
            msg.channel.send("We don't have permission to join the Channel");
            return;
        }
        if (!msg.member.voiceChannel.speakable) {
            msg.channel.send("We don't have permission to speak in the Channel");
            return;
        }
        args.shift();
        var words = args.join(" ");
        var info;
        console.log("searching now.")
        await ytdlInfo.getInfo(words).then(info_ => {
            console.log("found");
            info = info_.items
        }).catch(console.error);
        console.log(info);
        if (!info[0]) {
            msg.channel.send("Sorry. we can't find the video you were searching for.");
            return;
        }
        if (info[0].duration >= 3600) {
            msg.channel.send("Sorry. The video you requested is over an hour long.\nYou can get this limit lifted buy paying for Hexagon Premium. (available soon)");
            return;
        }
        if (!temp[msg.guild.id]) temp[msg.guild.id] = {queue: [], name: []};
        await temp[msg.guild.id].queue.push(info[0].url);
        temp[msg.guild.id].name.push(info[0].fulltitle);
        if (!temp[msg.guild.id].dispatcher) {
            msg.member.voiceChannel.join().then(connection => play(connection, msg.guild.id));
            msg.channel.send(`Playing: **${info[0].fulltitle}**`);
        } else {
            msg.channel.send(`Queued: **${info[0].fulltitle}**`);
        }
    }

    if (commandIs('skip', msg)) {
        if (!msg.client.voiceConnections) {
            msg.channel.send("I'm not in a voice channel currently.");
            return;
        }
        if (!temp[msg.guild.id].queue[0]) {
            msg.channel.send("There is nothing in the queue");
            return;
        }
    }

    if (commandIs('leave', msg)) {
        if (!msg.client.voiceConnections) {
            msg.channel.send("I'm not in a voice channel currently.");
            return;
        }
        temp[msg.guild.id].queue = null
        temp[msg.guild.id].dispatcher = null
        msg.member.voiceChannel.leave();
        msg.channel.send("Left the channel.");
    }
}); // end

client.login(config.token);