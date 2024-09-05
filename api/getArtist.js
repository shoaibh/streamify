import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "api", "data.json");
let data = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.body;

    if (data === null) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const songFrequency = data?.streams
      ?.filter((song) => {
        return Number(song.artist_id) === Number(id);
      })
      .reduce((acc, stream) => {
        const { song_id } = stream;
        if (!acc[song_id]) {
          acc[song_id] = 0;
        }
        acc[song_id]++;
        return acc;
      }, {});

    const artist = data?.artists.find((artist) => {
      return Number(artist?.artist_id) === Number(id);
    });

    const songEntries = Object.entries(songFrequency);

    songEntries.sort((a, b) => b[1] - a[1]);

    const top5Songs = songEntries.slice(0, 3);

    const songResult = [];

    top5Songs.forEach((song_id) => {
      const song = data.songs.find((song) => {
        return song.song_id === Number(song_id[0]);
      });
      if (song) songResult.push({ songName: song.song_name, streams: song_id[1], cover: song.cover });
    });

    res.status(200).json({
      artist,
      songResult,
    });
  }
}
