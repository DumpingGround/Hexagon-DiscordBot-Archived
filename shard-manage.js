const Discord = require('discord.js');
const Manager = new Discord.ShardingManager('./bot.js');

console.log("Shard Manager Started up");

Manager.spawn(1, 5000);

Manager.on('launch', shard => console.log("- Spawned in Shard: " + shard.id));