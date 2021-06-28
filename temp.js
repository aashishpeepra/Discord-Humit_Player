const getVideoUrl = require("./helper/getVideoUrl");
const getHumsFromStation = require("./helper/getHumsFromStation");
const buildSongQueue = require("./helper/buildSongQueue");
getVideoUrl("Daisy");
getHumsFromStation("Quarantunes");
buildSongQueue("Quarantunes")