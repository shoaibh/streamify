import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "api", "data.json");
let data = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { fromDate, toDate } = req.body;

    if (data === null) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const songFrequency = data?.streams
      ?.filter((song) => {
        const lastStreamedDate = new Date(song.stream_date);
        return lastStreamedDate >= new Date(fromDate) && lastStreamedDate <= new Date(toDate);
      })
      .reduce((acc, stream) => {
        const { song_id } = stream;
        if (!acc[song_id]) {
          acc[song_id] = 0;
        }
        acc[song_id]++;
        return acc;
      }, {});

    res.status(200).json({
      data,
    });
  }
}
