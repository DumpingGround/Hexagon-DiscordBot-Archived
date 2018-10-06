const Discord = require("discord.js");
const WebHooks = require("node-webhooks");
const FS = require("fs");
const Nexmo = require("nexmo");
const ytdl = require("ytdl-core");
const client = new Discord.Client();
const prefix = "h/"
const ytsearch = require('youtube-search');
var servqueue = {}

const options = {
  debug: false,
}

const streamOptions = { seek: 0, volume: 0.5 };

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

var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs
    httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes
})

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
  if(!servqueue[msg.guild.id].queue[0]) {
    
  }
  const queue = servqueue[msg.guild.id];
  queue.dispatcher = connection.playStream(ytdl(servqueue[msg.guild.id].queue[0], {filter: "audioonly"}));
  queue.queue.shift();
  queue.dispatcher.on("end", function() {
    if (queue.queue[0]) playmusic(connection, msg);
    else connection.disconnect();
  })
}

webHooks.add('discordtest', 'https://discordapp.com/api/webhooks/434856690643501068/TM0wGXX29MviIK-kajt18XpNhu22OqUCnmSBfYkDSJk1PZ9dBZy0LQ3wKBeDZN5has-9').then(function(){
	// done
}).catch(function(err){
	console.log(err)
})

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
      if(!servqueue[msg.guild.id]) {servqueue[msg.guild.id] = {queue: []}}
      servqueue[msg.guild.id].queue.push(ytvid);
      if (servqueue[msg.guild.id].dispatcher) {
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

  if (commandIs('skip', msg)) {
    if (servqueue[msg.guild.id].dispatcher) {
      servqueue[msg.guild.id].dispatcher.end();
      msg.channel.send("Skipped!");
    } else {
      msg.channel.send("Nothing is being played here.");
    }
  }

  if (commandIs('start', msg)) {
    msg.member.voiceChannel.join().then(connection => {
    playmusic(connection, msg);
    });
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
            .setAuthor("Hexagon Stats", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
            .setTitle("")
            .addField("Bot Stats", "")
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
  }

  if (commandIs('text', msg)) {
    if (msg.author.id = 189400912333111297) {
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

  

  if(commandIs('callmod', msg)) {
  var user = msg.author.username
  var userid = msg.author.id
}


  if (commandIs('privacy', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Hexagon", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
            .setTitle("")
            .addField("Privacy Policy", "Everything has to have a Privacy Policy and Terms of Service. So here we go.")
            .addField("Short Version", "We only collect your Username and ID, what you request the Bot to do, the outputs, and the errors which are caused by you.")
            .addField("Long Version", "One of HexDev and his Developer's Priorities is Privacy, Security, and Preventing Suspicious User Requests, Log Leaks, Sensitive User information leaks, and others. We collect Usernames & ID's to know who owns the group, ")
            .addField("IF YOU DO NOT AGREE TO THESE, PLEASE EITHER REMOVE THE BOT, OR DO NOT USE IT WHATSOEVER.", "Thank you for reading.")
            .setFooter("Last updated: 21 March 2018");
    msg.channel.send(embeded);
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


  if (commandIs('cmds', msg)) { // h/cmds
    var embeded = new Discord.RichEmbed()
      .setAuthor("Commands", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
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
    msg.author.send("Wait you want to add this bot? OMG, thank you very much.\nJoin the Discord server to have the latest news on the updates: https://discord.gg/XbaqS\n\nhttps://discordapp.com/oauth2/authorize?client_id=389528187295498252&scope=bot&permissions=2146954487");
  }

  if (commandIs('getpremium', msg)) { // h/getpremium
    var embeded = new Discord.RichEmbed()
      .setAuthor("Get Premium", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
      .setTitle("")
      .addField("Premium Features", "Be able to change the volume globally\nNo cooldown for")
      .addField("Where do I buy this: Premium Features/", "Well I thought you'd never ask.")
      .setFooter("Premium Features");
    msg.channel.send(embeded);
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
