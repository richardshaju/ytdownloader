const { log } = require("console");
var express = require("express");
var router = express.Router();
const fs = require("fs");

const cp = require("child_process");
const readline = require("readline");
// External modules
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg-static");

router.post("/", async (req, res, next) => {
  const data = {};
  let link = req.body.link;
  try {
    let info = await ytdl.getInfo(link);
    // console.log(link);
    // console.log(info);
    data.videoId = info.videoDetails.videoId
    data.title = info.videoDetails.title;
    data.channel = info.videoDetails.author.name;
    data.thumbnail = info.videoDetails.thumbnails[3].url;
  } catch (err) {
    console.log(err);
    data.title = "Invalid Link";
  }
  res.json(data);
  await getVideo(link, data.videoId)
  // ytdl(link ,{ quality: 'highestvideo' }).pipe(fs.createWriteStream("fsdf.mp4"));
});
  // Global constants
  function getVideo(link, title) {
    const ref = link;
    const tracker = {
      start: Date.now(),
      audio: { downloaded: 0, total: Infinity },
      video: { downloaded: 0, total: Infinity },
      merged: { frame: 0, speed: "0x", fps: 0 },
    };

    // Get audio and video streams
    const audio = ytdl(ref, { quality: "highestaudio" }).on(
      "progress",
      (_, downloaded, total) => {
        tracker.audio = { downloaded, total };
      }
    );
    const video = ytdl(ref, { quality: "highestvideo" }).on(
      "progress",
      (_, downloaded, total) => {
        tracker.video = { downloaded, total };
      }
    );

    // Prepare the progress bar
    let progressbarHandle = null;
    const progressbarInterval = 1000;
    const showProgress = () => {
      readline.cursorTo(process.stdout, 0);
      const toMB = (i) => (i / 1024 / 1024).toFixed(2);

      process.stdout.write(
        `Audio  | ${(
          (tracker.audio.downloaded / tracker.audio.total) *
          100
        ).toFixed(2)}% processed `
      );
      process.stdout.write(
        `(${toMB(tracker.audio.downloaded)}MB of ${toMB(
          tracker.audio.total
        )}MB).${" ".repeat(10)}\n`
      );

      process.stdout.write(
        `Video  | ${(
          (tracker.video.downloaded / tracker.video.total) *
          100
        ).toFixed(2)}% processed `
      );
      process.stdout.write(
        `(${toMB(tracker.video.downloaded)}MB of ${toMB(
          tracker.video.total
        )}MB).${" ".repeat(10)}\n`
      );

      process.stdout.write(
        `Merged | processing frame ${tracker.merged.frame} `
      );
      process.stdout.write(
        `(at ${tracker.merged.fps} fps => ${tracker.merged.speed}).${" ".repeat(
          10
        )}\n`
      );

      process.stdout.write(
        `running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(
          2
        )} Minutes.`
      );
      readline.moveCursor(process.stdout, 0, -3);
    };

    // Start the ffmpeg child process
    const ffmpegProcess = cp.spawn(
      ffmpeg,
      [
        // Remove ffmpeg's console spamming
        "-loglevel",
        "8",
        "-hide_banner",
        // Redirect/Enable progress messages
        "-progress",
        "pipe:3",
        // Set inputs
        "-i",
        "pipe:4",
        "-i",
        "pipe:5",
        // Map audio & video from streams
        "-map",
        "0:a",
        "-map",
        "1:v",
        // Keep encoding
        "-c:v",
        "copy",
        // Define output file
        title + ".mp4",
      ],
      {
        windowsHide: true,
        stdio: [
          /* Standard: stdin, stdout, stderr */
          "inherit",
          "inherit",
          "inherit",
          /* Custom: pipe:3, pipe:4, pipe:5 */
          "pipe",
          "pipe",
          "pipe",
        ],
      }
    );
    ffmpegProcess.on("close", () => {
      console.log("done");
      // Cleanup
      process.stdout.write("\n\n\n\n");
      clearInterval(progressbarHandle);
    });

    // Link streams
    // FFmpeg creates the transformer streams and we just have to insert / read data
    ffmpegProcess.stdio[3].on("data", (chunk) => {
      // Start the progress bar
      if (!progressbarHandle)
        progressbarHandle = setInterval(showProgress, progressbarInterval);
      // Parse the param=value list returned by ffmpeg
      const lines = chunk.toString().trim().split("\n");
      const args = {};
      for (const l of lines) {
        const [key, value] = l.split("=");
        args[key.trim()] = value.trim();
      }
      tracker.merged = args;
    });
    audio.pipe(ffmpegProcess.stdio[4]);
    video.pipe(ffmpegProcess.stdio[5]);
  }


module.exports = router;
