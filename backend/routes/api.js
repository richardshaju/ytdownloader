var express = require("express");
var router = express.Router();
const ytdl = require("ytdl-core");

router.post("/", async (req, res, next) => {
  const data = {};
  var link = req.body.link;
  let info = await ytdl.getInfo(link);

  data.title = info.videoDetails.title;
  data.channel = info.videoDetails.author.name;
  data.thumbnail = info.videoDetails.thumbnails[3].url;

  res.json(data);
});

module.exports = router;
