const Discord = require("discord.js");
const fs = require("fs");
const Nexmo = require("nexmo");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const prefix = "h/"
const ytsearch = require('youtube-search');
const errormessages = ["(╯°□°）╯︵ ┻━┻", "God mom I just wanted to try this command!", "Huh? Whats this?", "Stapling the door back on its hinges in progress...", "Thats quite big. Impressive. *(hes talking about an error)*", "ooo. Thats quite small. Yikes. *(hes talking about the error)*", "Hmm. I cant think of any more jokes at the moment.", "¯\_(ツ)_/¯"]
var tempramstor = {}
var permstor = {}

const options = {
  debug: false,
}

const streamOptions = { seek: 0, volume: 0.5, filter: "audioonly" };

var ytopts = {
  maxResults: 1,
  key: 'AIzaSyBpYR6knsFikarpJyTWr3wMLK_Fe6UfM60'
};

const nexmo = new Nexmo({
  apiKey: "69061ad7",
  apiSecret: "MoHWv2fc8S8PXFh4"
}, options);

function commandIs(str, msg) {
    // Return Information + Accept Multiple Prefixes
    return msg.content.toLowerCase().startsWith(prefix + str);
}

function formatSecs(seconds) {
    // Get Days/Hours/Minutes/Seconds
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;

    // Format Calculations
    var result = numdays + ":" + numhours + ":" + numminutes + ":" + numseconds;

    // Return Result
    return result;
}

function playmusic(connection, msg) {
  const queue = tempramstor[msg.guild.id];
  queue.dispatcher = connection.playStream(ytdl(tempramstor[msg.guild.id].queue[0], streamOptions));
  queue.now = tempramstor[msg.guild.id].queue[0]
  queue.queue.shift();
  queue.name.shift();
  queue.dispatcher.on("end", function() {
    if (queue.queue[0]) playmusic(connection, msg);
    else {
      connection.disconnect();
      queue.dispatcher = null
    }
  })
}

function loadpermstor() {
  console.log("Loading permstor variable...");
  var __permstor = fs.readFileSync('permanentstorage.json', 'utf8');
  permstor = JSON.parse(__permstor);
  console.log("Loaded Successfully.");
}

function savepermstor() {
  savethis = JSON.stringify(permstor);
  fs.writeFileSync('permanentstorage.json', savethis);
}

function setupguildpermstor(idofguild) {
  permstor[idofguild] = { "reportchannel": null}
}

client.on('ready', async () => {
  await loadpermstor();
  console.log(`Logged in as ${client.user.tag}!`);
  setInterval(function(){ savepermstor(); }, 3000);
});

client.on('ready', async () => {
  client.user.setActivity("Loading Status...");
  setInterval(function(){
    if (permstor.maintenance == false) {
    client.user.setActivity("over " + client.users.size + " People 👀", {type: "WATCHING"})
    setTimeout(function(){client.user.setActivity("over " + client.guilds.size + " Guilds 👀", {type: "WATCHING"})}, 5000);
    setTimeout(function(){client.user.setActivity("requests on music", {type: "LISTENING"})}, 10000);
    setTimeout(function(){client.user.setActivity("Hexagon | h/help", {type: "PLAYING"})}, 15000);
  } else {
    client.user.setActivity("⚠️ MAINTENACE MODE ACTIVATED ⚠️", {type: "PLAYING"})
  }
  }, 25000);
});

client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);
  var slasharg = msg.content.split("/");

  if (commandIs('nugget', msg)) {
    const m = await msg.channel.send("Disabling Maintenance Mode, Please wait...");
    permstor.maintenance = false;
    m.edit("Successfully disabled Maintenance!");
  }
  if (permstor.maintenance == true) {
    if (msg.guild.id == 189400912333111297) {
    } else {
      return;
    }
  }
  
  if (commandIs('ping', msg)) {
      const m = await msg.channel.send(":ping_pong: Pinging...");
      m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | <:discordhex:503505173788884992> **API** ${Math.round(client.ping)}ms`);
    }

  if (commandIs('maintenance', msg)) {
    if (msg.member.id != 189400912333111297) {
      msg.channel.send(" *(Error 401 - Invalid Permissions)*");
      return;
    }
    if (permstor.maintenance == true) {
      const m = await msg.channel.send("Disabling Maintenance Mode, Please wait...");
      permstor.maintenance = false;
      m.edit("Successfully disabled Maintenance!");
    } else {
      const m = await msg.channel.send("Enabling Maintenance Mode, Please wait...");
      permstor.maintenance = true;
      m.edit("Successfully enabled Maintenance!");
    }
  }

  if (commandIs('saveall', msg)) {
    if (msg.member.id != 189400912333111297) {
      msg.channel.send(" *(Error 401 - Invalid Permissions)*");
      return;
    }
    const m = await msg.channel.send("Saving...");
    await savepermstor();
    m.edit("Saved!");
  }

  if (commandIs('play', msg)) {
    args.shift();
    var words = args.join(" ");
    console.log("Searching for video: " + words);
    var searchytdl;
    ytsearch(words, ytopts, function(err, searchytdl) {
      if(err) {
        console.log(err);
        msg.channel.send("There was an Error.");
      }
      if(!searchytdl[0]) {
        console.log("Failed to find video");
        msg.channel.send("Could not find the video you were looking for.");
        return;
      }
      msg.member.voiceChannel.join().then(connection => {
      var ytvid = searchytdl[0].link;
      console.log(ytvid);
      if(!tempramstor[msg.guild.id]) {tempramstor[msg.guild.id] = {queue: [], name: []}}
      tempramstor[msg.guild.id].queue.push(ytvid);
      tempramstor[msg.guild.id].name.push(searchytdl[0].title);
      if (tempramstor[msg.guild.id].dispatcher) {
        console.log("Queued " + ytvid);
        msg.channel.send("Queued **" + searchytdl[0].title + "**");
      } else {
      console.log("Playing " + ytvid);
      playmusic(connection, msg);
      msg.channel.send("Playing **" + searchytdl[0].title + "**");
      }
      });
    });
  }

  if (commandIs('queue', msg)) {
    if (!tempramstor[msg.guild.id]) {
      msg.channel.send("There was an error whiles attempting to find your queue");
      return;
    }
    if (!tempramstor[msg.guild.id].name) {
      msg.channel.send("There is nothing in your queue.");
    }
      msg.channel.send(tempramstor[msg.guild.id].name);
  }

  if (commandIs('clearqueue', msg)) {
    if (!tempramstor[msg.guild.id]) {
      msg.channel.send("There was an error whiles attempting to find your queue");
      return;
    }
    if(!tempramstor[msg.guild.id]) {tempramstor[msg.guild.id] = {queue: [], name: []}}
    tempramstor[msg.guild.id] = {name: [], queue: []};
    var i = tempramstor[msg.guild.id].queue.length
    msg.channel.send("Your queue was cleared. Cleared: " + i + " Songs.");
  }

  if (commandIs('skip', msg)) {
    if (tempramstor[msg.guild.id].dispatcher) {
      tempramstor[msg.guild.id].dispatcher.end();
      msg.channel.send("Skipped!");
    } else {
      msg.channel.send("Nothing is being played here.");
    }
  }
  
  if (commandIs('rolldice', msg)) {
    const m = await msg.channel.send("<:rolling:497532919804461067>");
    var _dice = Math.random();
    _dice = _dice * 5
    _dice = Math.round(_dice);
    if (_dice == 0) {
      msg.channel.send("<:dice6:497532948388642816>");
      m.delete();
      return;
    } else if (_dice == 1) {
      msg.channel.send("<:dice1:497532942877196298>");
      m.delete();
      return;
    } else if (_dice == 2) {
      msg.channel.send("<:dice2:497532944030629915>");
      m.delete();
      return;
    } else if (_dice == 3) {
      msg.channel.send("<:dice3:497532944832004098>");
      m.delete();
      return;
    } else if (_dice == 4) {
      msg.channel.send("<:dice4:497532947528679424>");
      m.delete();
      return;
    } else if (_dice == 5) {
      msg.channel.send("<:dice5:497532947683868683>");
      m.delete();
      return;
    }
  }

  if (commandIs('leave', msg)) {
    msg.member.voiceChannel.leave();
  }

  if (commandIs('setgame', msg)) {
    if (msg.author.id == 189400912333111297) {
      args.shift();
      var words = args.join(" ");
      console.log("Changing game to `" + words + " | Hexagon | madeby.hexdev.xyz/hexagon`");
      client.user.setGame(words + " | Hexagon | madeby.hexdev.xyz/hexagon");
      console.log("Successfully Completed changing game");
      msg.react("👍");
    }
  }

  if (commandIs('setstatus', msg)) {
    if (msg.author.id == 189400912333111297) {
      console.log("Changing status to" + args[1])
      client.user.setStatus(args[1]);
      console.log("Successfully Completed changing status");
      msg.react("👍");
    }
  }

  if (commandIs('summon', msg)) {
    if (!msg.member.voiceChannel) {
      msg.channel.send("You're currently not in a channel");
      return;
    }
    if (msg.member.voiceChannel.joinable != true) {
      msg.channel.send("Can't join the Voice Channel you're in");
      return;
    }
    if (msg.member.voiceChannel.speakable != true) {
      msg.channel.send("Can't speak in the Voice Channel you're in");
      return;
    }
    msg.member.voiceChannel.join();
  }

  if (commandIs('stats', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Hexagon Stats", "https://cdn.hexdev.xyz/hexagon/hexagon-logo.png")
            .setTitle("")
            .addField("User", ":bust_in_silhouette: **Users** - " + client.users.size + "\n:house: **Guilds** - " + client.guilds.size, true)
            .addField("Technical", "<:ramhex:503505176653594634> **RAM Usage** - " + Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB" + "\n<:nodejshex:503505175252566016> **Node.js Version** - " + process.version + "\n<:discordhex:503505173788884992> **Discord.js Version** - v" + Discord.version + "\n:timer: **Uptime** - " + client.uptime/1000 + "s", true)
            .setTimestamp()
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
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

  if (commandIs('text', msg)) {
    if (msg.author.id == 189400912333111297 || msg.author.id == 256551275578130433) {
      var number = args[1]
      var err
      var responseData
      args.shift();
      args.shift();
      var words = args.join(" ");
      nexmo.message.sendSms("12015358934", number, words, {type: "unicode"},(err, responseData) => {
        if(err) {
          console.log(err);
          msg.channel.send("Oops. We had an error");
        } else {
          console.dir(responseData);
          msg.channel.send("Your message was successfully sent.");
        }
      }
    );
    } else {
      msg.channel.send("nop");
    }
  }

  if (commandIs('setlogs', msg)) {

  }

  if (commandIs('setreportchannel', msg)) {
    if (!msg.member.hasPermission("MANAGE_CHANNELS")) {
      var i;
      // errmess(i);
      msg.channel.send(i + " *(Error 401 - Invalid Permission)*");
      return;
    }
    if (!args[1]) {
      msg.channel.send("Your Report channel has been reset");
    }
    var servid = args[1].match(/\d/g);
    servid = servid.join("");
    if (!permstor[msg.guild.id]) {setupguildpermstor(msg.guild.id);}
    permstor[msg.guild.id].reportchannel = servid;
    client.channels.get(servid).send("Got it, we'll send all reports to this channel :)");
  }

  if (commandIs('report', msg)) {
    msg.delete();
    if (!permstor[msg.guild.id] || !permstor[msg.guild.id].reportchannel) {
      msg.channel.send("Report hasn't been configured for this server properly.");
      return;
    }
    const _i = args[1]
    args.shift();
    args.shift();
    const reason = args.join(" ");
    if (reason == null) {
      reason = "Not Specified.";
    }
    var embeded = new Discord.RichEmbed()
      .setAuthor("Report", "https://cdn.hexdev.xyz/hexagon/hexagon-logo.png")
      .setTitle("")
      .addField("Reported By", "<@" + msg.author.id + ">", true)
      .addField("Reported User", _i, true)
      .addField("Reason", reason)
      .setTimestamp()
      .setFooter("Requested from " + msg.author.username);
    client.channels.get(permstor[msg.guild.id].reportchannel).send(embeded);
  }

/*
  if (commandIs('generror', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("ERROR", "https://tropical-wrist.000webhostapp.com/Cross.png")
            .setTitle("")
            .addField("Oops?", "How the hell did you get here?")
            .setFooter("Error 1, Force Error");
    msg.channel.send(embeded);
  }

  if (commandIs('gencorrect', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Complete", "https://tropical-wrist.000webhostapp.com/Correct.png")
            .setTitle("")
            .addField("Redeemed.", "Your code was redeemed")
            .setFooter("0+ Credit added to account.");
    msg.channel.send(embeded);
  }
*/
  if (commandIs('myid', msg)) {
	  msg.channel.send("ID for **" + msg.author.username + "** is *"+ msg.author.id + "*");
  }


  if (commandIs('help', msg)) { // h/cmds
    var embeded = new Discord.RichEmbed()
      .setAuthor("Commands", "https://cdn.hexdev.xyz/hexagon/hexagon-logo.png")
      .setTitle("")
      .addField("General", "**h/cmds** - This is what you're looking at right now.\n**h/vote <Question>** - Create a :thumbsup: or :thumbsdown: poll.\n**h/rolldice** - Simply rolls a dice.")
      .addField("Technical Commands", "**h/myid** - Gives you your `user-id`.")
      .addField("Music Commands", "**h/summon** - Makes the bot join your voice channel.\n**h/play <Link or Search>** - Plays a song.\n**h/pause** - Pauses song *[N/A ATM]*\n**h/leave** - Leaves the voice channel.")
      .setFooter("Requested by " + msg.author.username);
    msg.channel.send(embeded);
  }

  if (commandIs('vote', msg)) { // h/vote <question>
    args.shift();
    var words = args.join(" ");
    if (words !== null) {
     var embeded = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setTitle("")
      .addField("Question from " + msg.author.username, words)
      .setFooter("Hexagon, A bot by HexDev#0001");
     var m = await msg.channel.send(embeded);
     m.react("👍");
     m.react("👎");
    } else {
      msg.channel.send("Error: Put a question.")
    }
  }

  if (commandIs('invite', msg)) {
    msg.channel.send("I sent it to you :thumbsup:");
    var embeded = new Discord.RichEmbed()
      .setAuthor("Invite", "https://cdn.hexdev.xyz/hexagon/hexagon-logo.png")
      .addField("Invite Link", "You can invite it by clicking [here](https://discordapp.com/oauth2/authorize?client_id=389528187295498252&scope=bot&permissions=2146954487)")
      .setTimestamp()
      msg.author.send(embeded);
  }

  if (commandIs('evaluate', msg)) { // h/evaluate <Script>
    if (msg.author.id != 189400912333111297) {
      msg.channel.send("Do you even lift bro? *(Error 401)*");
      return;
    } else {
      args.shift();
      var words = args.join(" ");
     if (words !== null) {
       await msg.channel.startTyping();
       await setTimeout(function(){ try {eval(words);} catch(e) {console.error(e)} }, 500);
       msg.channel.stopTyping();
       msg.react("👍");
      }
    }
  }




}); //END OF SHITE

client.login('Mzg5NTI4MTg3Mjk1NDk4MjUy.DQ9QVg.v-p4d-RWMe_qcFGYOBRZJvLTMlk');
