const ytdl = require("ytdl-core");
const getVideoUrl = require("../helper/getVideoUrl");
const buildSongQueue = require("../helper/buildSongQueue");

module.exports = {
  name: "play",
  description: "Play all hums in a Station",
  async execute(message) {
    try {
      const args = message.content.split(" ");
      const queue = message.client.queue;
      const serverQueue = message.client.queue.get(message.guild.id);

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }
      message.channel.send(`${args[1]} is a nice station. Let me load a few hums first 🎵`)
      const {firstHumData:songInfo,nextHums} = await buildSongQueue(args[1]);
      console.log(songInfo)
      if(songInfo.length==0)
      {
        message.channel.send(`Looks like I can't find ${args[1]} 🎵`);
        return;
      }
      
      const song = songInfo[0];
      console.log(songInfo);
      if (!serverQueue) {
        const queueContruct = {
          textChannel: message.channel,
          voiceChannel: voiceChannel,
          connection: null,
          songs: [],
          volume: 5,
          playing: true
        };
        

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);
        nextHums.then(songsFromHum=>{
          try{
            // console.log(songsFromHum,serverQueue)
            songsFromHum.forEach(song=>queueContruct.songs.push(song));
          }  catch(err){
            console.log(err,"WHILE ADDING NEXT HUMS INTO SONGQUEUE")
          }
        })
        try {
          var connection = await voiceChannel.join();
          queueContruct.connection = connection;
          this.play(message, queueContruct.songs[0]);
        } catch (err) {
          console.log(err);
          queue.delete(message.guild.id);
          return message.channel.send(err);
        }
      } else {
        serverQueue.songs.push(song);
        return message.channel.send(
          `${song.title} has been added to the queue!`
        );
      }
      
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
    }
    
  },

  play(message, song) {
    const queue = message.client.queue;
    const guild = message.guild;
    const serverQueue = queue.get(message.guild.id);

    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
    
    const playNextSong = ()=>{
      serverQueue.songs.shift();
      this.play(message, serverQueue.songs[0]);
      clearInterval(interval);
    }
    let interval;
    
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        // serverQueue.songs.shift();
        // this.play(message, serverQueue.songs[0]);
        // playNextSong()
      })
      .on("start",temp=>{
        if(interval)
          clearInterval(interval);
        console.log("started");
        interval = setInterval(()=>{
          dispatcher.pause();
          playNextSong();
        },30000);

      })
      .on("error", error => console.error(error));


    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    //customize the message sent when the song starts
    serverQueue.textChannel.send(`Started playing: **${song.title}**`,{files:[song.thumbnail]});
  }
};
