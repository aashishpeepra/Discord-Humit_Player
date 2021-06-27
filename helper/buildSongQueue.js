const getVideoUrl = require("./getVideoUrl");
const getHumsFromStation = require("./getHumsFromStation");

module.exports = async (station, lastId) => {
  const getHums = await getHumsFromStation(station, lastId);
  let songs = [];
  for(let i=0;i<getHums.length;i++)
  {
      let songInfo = await getVideoUrl(getHums[i].song_title);
      console.log(songInfo)
      if(songInfo.length>0)
      {
        songInfo = songInfo[0]
        let temp = {
          title: songInfo.title,
          url: songInfo.url,
          thumbnail: songInfo.bestThumbnail.url,
          start:getHums[i].start_seconds,
          end:getHums[i].end_seconds
        };
        // console.log(temp);
        songs.push(temp)
      }
  }
  
  return songs;
};
