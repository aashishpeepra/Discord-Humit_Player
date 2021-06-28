const getVideoUrl = require("./getVideoUrl");
const getHumsFromStation = require("./getHumsFromStation");

async function get_youtube_from_hums(hums) {
  // this function takes an array hums. and returns the youtube information
  let songs = [];
  for (let i = 0; i < hums.length; i++) {
    let songInfo;
    try{
      songInfo = await getVideoUrl(hums[i].song_title);
      
    }catch(err){
      console.error(err,"WHILE GETTING YOUTUBE INFORMATION",hums[i].song_title);
      continue; // skipping this song
    }
    // console.log(songInfo);
    if (songInfo.length > 0) {
      songInfo = songInfo[0];
      // data model to push
      let temp = {
        title: songInfo.title,
        url: songInfo.url,
        thumbnail: songInfo.bestThumbnail.url,
        start: hums[i].start_seconds,
        end: hums[i].end_seconds,
      };
      
      songs.push(temp);
    }
  }
  return songs;
}

module.exports = async (station, lastId) => {
  const getHums = await getHumsFromStation(station, lastId); // get hums from backend
  // console.log(getHums)
  if (getHums.length == 0) {
    // in case a station is not found
    return [];
  }

  const firstHumData = await get_youtube_from_hums([getHums[0]]);
  // console.log(firstHumData,getHums[0])
  const nextHums = get_youtube_from_hums(getHums.slice(1));

  return {
    firstHumData: firstHumData,
    nextHums: nextHums
  }

};
