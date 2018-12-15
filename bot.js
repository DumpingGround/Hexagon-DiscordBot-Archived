const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "h/"

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
