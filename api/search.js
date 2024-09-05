import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "api", "data.json");
let data = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { searchStr } = req.body;

    if (data === null) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const artistFrequency = data?.streams?.reduce((acc, stream) => {
      const { artist_id } = stream;
      if (!acc[artist_id]) {
        acc[artist_id] = 0;
      }
      acc[artist_id]++;
      return acc;
    }, {});

    let artists;

    if (!searchStr) {
      artists = [];
    } else {
      artists = data?.artists.filter((artist) => {
        return artist?.artist_name.toLowerCase().includes(searchStr.toLowerCase());
      });
    }

    const artistEntries = Object.entries(artistFrequency);

    artistEntries.sort((a, b) => b[1] - a[1]);

    const top5Artists = artistEntries.slice(0, 5);

    const artistResult = [];

    top5Artists.forEach((artist_id) => {
      const artist = data.artists.find((artist) => {
        return artist.artist_id === Number(artist_id[0]);
      });
      if (artist) artistResult.push(artist);
    });

    res.status(200).json({
      searchedArtist: artists,
      artistResult,
    });
  }
}
