const Discord = require("discord.js");
const { getInfo } = require("ytdl-getinfo");
const ytdl = require("ytdl-core-discord");
const fs = require("fs");
const client = new Discord.Client();
const errormessages = ["(╯°□°）╯︵ ┻━┻", "God mom I just wanted to try this command!", "Huh? Whats this?", "Stapling the door back on its hinges in progress...", "Thats quite big. Impressive. *(hes talking about an error)*", "ooo. Thats quite small. Yikes. *(hes talking about the error)*", "Hmm. I cant think of any more jokes at the moment.", "¯\_(ツ)_/¯", "You idiot, what did you do?", "（◞‸◟）We're sowwy ;-;.", "Well this is awkward.. (゜○゜)"]
var temp = []

let configraw = fs.readFileSync('config (DO NOT OPEN).json') 
let config = JSON.parse(configraw);

if (config.canary == true) {
  var prefix = '*/'
}
if (config.ptb == true) {
  var prefix = 'h2/'
}
if (config.ptb == false && config.canary == false) {
  var prefix = 'h/'
}

function commandIs(str, msg) {
    // Return Information + Accept Multiple Prefixes
    return msg.content.toLowerCase().startsWith(prefix + str);
}

async function play(connection, url) {
  connection.playOpusStream(await ytdl(url));
}

// FUNCTIONS ABOVE HERE
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame("Hexagon | h/cmds | madeby.hexdev.xyz/hexagon");
});

client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);
  var slasharg = msg.content.split("/");
  
  if (commandIs('ping', msg)) {
      const m = await msg.channel.send(":ping_pong: Pinging...");
      m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
    }
  
  if (commandIs('serverstats', msg)) {
    var regionemoji;
    if (msg.guild.region === "eu-west" || msg.guild.region === "eu-central") {
      regionemoji = ":flag_eu:";
    }
    if (msg.guild.region === "japan") {
      regionemoji = ":flag_jp:";
    }
    if (msg.guild.region === "sydney") {
      regionemoji = ":flag_au:";
    }
    if (msg.guild.region === "us-central" || msg.guild.region === "us-east" || msg.guild.region === "us-south" || msg.guild.region === "us-west") {
      regionemoji = ":flag_us:";
    }
    if (msg.guild.region === "russia") {
      regionemoji = ":flag_ru:";
    }
    if (msg.guild.region === "brazil") {
      regionemoji = ":flag_br:";
    }
    if (msg.guild.region === "southafrica") {
      regionemoji = ":flag_za:";
    }
    if (msg.guild.region === "hongkong") {
      regionemoji = ":flag_hk:";
    }
    if (msg.guild.region === "singapore") {
      regionemoji = ":flag_sg:";
    }
    var embeded = new Discord.RichEmbed()
            .setAuthor(msg.guild.name + " Stats", msg.guild.iconURL)
            .setTitle("")
            .addField("General", ":bust_in_silhouette: **Users** - " + msg.guild.memberCount + "\n:busts_in_silhouette: **Channels** - " + msg.guild.channels.size, true)
            .addField("Technical", "**Server Location** - " + regionemoji + " " + msg.guild.region + "\n**Verification Level** - " + msg.guild.verificationLevel + "\n**Guild ID** - " + msg.guild.id, true)
            .setTimestamp()
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
  }

  if (commandIs('stats', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Hexagon Stats", "https://cdn.hexdev.xyz/hexagon/hexagon-logo.png")
            .setTitle("")
            .addField("User", ":bust_in_silhouette: **Users** - " + client.users.size + "\n:busts_in_silhouette: **Channels** - " + client.channels.size + "\n:speaking_head: **V-Connections** - " + client.voiceConnections.size + "\n:house: **Guilds** - " + client.guilds.size, true)
            .addField("Technical", "<:ramhex:503505176653594634> **RAM Usage** - " + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB" + "\n<:nodejshex:503505175252566016> **Node.js Version** - " + process.version + "\n<:discordhex:503505173788884992> **Discord.js Version** - v" + Discord.version + "\n:timer: **Uptime** - " + client.uptime/1000 + "s" + "\n**Shard ID** - " + "<currently not using shards>", true)
            .setTimestamp()
            .setFooter("Requested from " + msg.author.username, msg.author.avatarURL);
    msg.channel.send(embeded);
  }

  if (commandIs('summon', msg)) {
    if (!msg.guild) {
      msg.channel.send("<:errorhex:535607623710408734> You're not in a guild, so we cannot summon it.");
      return;
    }
    if (msg.guild.voiceConnection) {
      msg.channel.send("<:errorhex:535607623710408734> Sorry. I am already in a channel.");
      return;
    }
    if (!msg.member.voiceChannel) {
      msg.channel.send("<:errorhex:535607623710408734> You're not in a voice channel.");
      return;
    }
    msg.member.voiceChannel.join();
  }

  if (commandIs('play', msg)) {
    if (!msg.guild) {
      msg.channel.send("<:errorhex:535607623710408734> You're not in a guild, so we cannot play music.");
      return;
    }
    if (!msg.guild.voiceConnection) {
      msg.channel.send("<:errorhex:535607623710408734> The bot isn't in any voice channels at the moment. You can summon it by doing h/summon");
      return;
    }

    if (!args[1]) {
      msg.channel.send("<:errorhex:535607623710408734> You need to put in a video name or url.");
    }
    /* if (client.guild.user.voiceChannel !== msg.member.voiceChannel) {
      msg.channel.send("You're not in the same channel as the bot.");
      return;
    } */
    m = await msg.channel.send('<a:loading:505383836172156948>');
    args.shift();
    var words = args.join(" ");
    await getInfo(words).then(info => {
      var embeded = new Discord.RichEmbed()
      embeded.setTitle("");
      embeded.addField(`Now playing: **${info.items[0].title}**`, `Duration: ${info.items[0].duration}`);
      embeded.setImage(info.items[0].thumbnail);
      embeded.setTimestamp();
      embeded.setFooter("Requested from " + msg.author.username, msg.author.avatarURL);
      m.edit(embeded);
      msg.member.voiceChannel.join().then(connection => {
        play(connection, info.items[0].webpage_url);
      })
    })
  }

  if (commandIs('leave', msg)) {
    if (!msg.guild.voiceConnection) {
      msg.channel.send("The bot isn't in a channel.");
      return;
    }
    /* if (client.guild.voiceChannel !== msg.member.voiceChannel) {
      msg.channel.send("You're not in the same channel as the bot.");
      return;
    } */
    msg.member.voiceChannel.leave();
  }




}); //END OF SHITE

if (config.canary == true) {
  client.login(config.canarytoken);
}
if (config.ptb == true) {
  client.login(config.ptbtoken);
} 
if (config.ptb == false && config.canary == false) {
  client.login(config.token);
}