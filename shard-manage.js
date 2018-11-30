const Discord = require('discord.js');
const shards = new Discord.ShardingManager('./bot.js', {
    token: 'Mzg5NTI4MTg3Mjk1NDk4MjUy.DQ9QVg.v-p4d-RWMe_qcFGYOBRZJvLTMlk',
});

console.log("Shard Manager Online, Starting up Shards...");

shards.spawn(1, 5000);

shards.on('launch', shard => console.log("- Spawned in Shard: " + shard.id));

shards.on('message', (shard, message) => {
    console.log('shard id: ' + shard.id + "\nMESSAGE: \n" + message);
});