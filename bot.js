const Discord = require("discord.js");
const client = new Discord.Client();
const errormessages = ["(╯°□°）╯︵ ┻━┻", "God mom I just wanted to try this command!", "Huh? Whats this?", "Stapling the door back on its hinges in progress...", "Thats quite big. Impressive. *(hes talking about an error)*", "ooo. Thats quite small. Yikes. *(hes talking about the error)*", "Hmm. I cant think of any more jokes at the moment.", "¯\_(ツ)_/¯", "You idiot, what did you do?", "（◞‸◟）We're sowwy ;-;.", "Well this is awkward.. (゜○゜)"]
const prefix = "h/"
var temp = []

function commandIs(str, msg) {
    // Return Information + Accept Multiple Prefixes
    return msg.content.toLowerCase().startsWith(prefix + str);
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
            .setAuthor("Server Stats", msg.guild.iconURL)
            .setTitle("")
            .addField("General", ":bust_in_silhouette: **Users** - " + msg.guild.memberCount, true)
            .addField("Technical", "**Server Location** - " + regionemoji + " " + msg.guild.region + "\n**Verification Level** - " + msg.guild.verificationLevel + "\n**Guild ID** - " + msg.guild.id, true)
            .setTimestamp()
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
  }

  if (commandIs('stats', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Hexagon Stats", "https://cdn.hexdev.xyz/hexagon/hexagon-logo.png")
            .setTitle("")
            .addField("User", ":bust_in_silhouette: **Users** - " + client.users.size + "\n:house: **Guilds** - " + client.guilds.size, true)
            .addField("Technical", "<:ramhex:503505176653594634> **RAM Usage** - " + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB" + "\n<:nodejshex:503505175252566016> **Node.js Version** - " + process.version + "\n<:discordhex:503505173788884992> **Discord.js Version** - v" + Discord.version + "\n:timer: **Uptime** - " + client.uptime/1000 + "s." + "\n**Shard ID** - " + "<currently not using shards>", true)
            .setTimestamp()
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
  }




}); //END OF SHITE
