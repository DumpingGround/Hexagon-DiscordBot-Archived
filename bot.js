const Discord = require("discord.js");
const WebHooks = require("node-webhooks");
const FS = require("fs");
const client = new Discord.Client();
const prefix = "h/"

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

webHooks.add('discordtest', 'https://discordapp.com/api/webhooks/434856690643501068/TM0wGXX29MviIK-kajt18XpNhu22OqUCnmSBfYkDSJk1PZ9dBZy0LQ3wKBeDZN5has-9').then(function(){
	// done
}).catch(function(err){
	console.log(err)
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame("Hexagon | madeby.hexdev.xyz/hexagon");
});

client.on('message', async msg => {
  var args = msg.content.split(/[ ]+/);
  var slasharg = msg.content.split("/");
  if (commandIs('ping', msg)) {
      const m = await msg.channel.send(":ping_pong: Pinging...");
      m.edit(`:ping_pong: **Bot** ${m.createdTimestamp - msg.createdTimestamp}ms | **API** ${Math.round(client.ping)}ms`);
    }

  if (commandIs('info', msg)) {
    msg.channel.send("Sending...");

  }

  if (commandIs('info', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Hexagon", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
            .setTitle("")
            .addField("Information", "Hexagon (Formerly known as Music4All) is a client which can do many things. It can moderate, play music, and do some fun commands.\n h/cmd to have a look at the commands.")
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
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

  if (commandIs('stats', msg)) {
    var embeded = new Discord.RichEmbed()
            .setAuthor("Hexagon Stats", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
            .setTitle("")
            .addField("Bot Stats",)
            .setFooter("Requested from " + msg.author.username);
    msg.channel.send(embeded);
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

  if (commandIs('join', msg)) { // h/join
    var embeded = new Discord.RichEmbed()
      .setAuthor("ERROR", "https://tropical-wrist.000webhostapp.com/Cross.png")
      .setTitle("")
      .addField("Oops?", "Music is currently not available, Sorry ;-;")
      .setFooter("Error 401, Unauthorized. Access Denied due to invalid credentials.");
    msg.channel.send(embeded);
  }

  if (commandIs('play', msg)) { // h/play
    var embeded = new Discord.RichEmbed()
      .setAuthor("ERROR", "https://tropical-wrist.000webhostapp.com/Cross.png")
      .setTitle("")
      .addField("Oops?", "Music is currently not available, Sorry ;-;")
      .setFooter("Error 401, Unauthorized. Access Denied due to invalid credentials.");
    msg.channel.send(embeded);
  }


  if (commandIs('cmds', msg)) { // h/cmds
    var embeded = new Discord.RichEmbed()
      .setAuthor("Commands", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
      .setTitle("")
      .addField("General", "**h/cmds** - This is what you're looking at right now.\n**h/vote <Question>** - Create a :thumbsup: or :thumbsdown: poll.")
      .setFooter("Requested by " + msg.author.username);
    msg.channel.send(embeded);
  }

  if (commandIs('vote', msg)) { // h/vote <question>
    args.shift();
    var words = args.join("");
    if (words !== null) {
     var embeded = new Discord.RichEmbed()
      .setAuthor(msg.author.username, msg.author.avatarURL)
      .setTitle("")
      .addField("Question from " + msg.author.username, words)
      .setFooter("Requested from " + msg.author.username);
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

  if (commandIs('sendnudes', msg)) { // h/sendnudes
    const m = await msg.channel.send("<a:loading:443159878815711232>");
    console.log("Uploading Image now.");
    var nudepics = new Discord.Attachment("MineDev.png", "minedev.png");
    await msg.channel.send(nudepics);
    m.delete();
    console.log("Image Uploaded");
  }

  if (commandIs('donations', msg)) { // h/donations
    var embeded = new Discord.RichEmbed()
      .setAuthor("Donations", "https://tropical-wrist.000webhostapp.com/Hexagonal.png")
      .setTitle("")
      .addField("Wait what?", "Wait you really want to donate to me? That would, tbh, mean a lot ;)")
      .addField("CryptoCoins", "**BTC** - 1LasfG1ZsrE3b9LaisHgeaK4RAs7Gw8mij\n**ETH** - 0x2D34a6936C1bDE4CF1ccF58c9BaE718f2b136579\n**BCH** - qzs0qwuljmgh3zgqf7p2vh4lzdykyxqunctutjgvcw")
      .addField("Paypal", "Yeah, I'd rather you contact me on this one.")
      .setFooter("This guy wants to donate, don't ban him.");
    msg.channel.send(embeded);
  }

  if (commandIs('evaluate', msg)) { // h/evaluate <Script>
    if (msg.author.id != 189400912333111297) {
      msg.channel.send("Do you even lift bro? *(Error 401)*");
      return;
    } else {
      args.shift();
      var words = args.join("");
     if (words !== null) {
       await msg.channel.startTyping();
       await setTimeout(function(){ try {eval(words);} catch(e) {console.error(e)} }, 100);
       msg.channel.stopTyping();
       msg.react("👍");
      }
    }
  }




}); //END OF SHITE

client.login('Mzg5NTI4MTg3Mjk1NDk4MjUy.DQ9QVg.v-p4d-RWMe_qcFGYOBRZJvLTMlk');
