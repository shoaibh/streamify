import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "api", "data.json");
let data = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { fromDate, toDate, revenueSource, page, sortBy = "date_streamed", order = "desc", searchStr: searchStrDefault } = req.body;

    if (data === null) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
    const searchStr = searchStrDefault?.toLowerCase();

    const songFrequency = data?.streams
      ?.filter((song) => {
        const lastStreamedDate = new Date(song.stream_date);
        let filterCnd = lastStreamedDate >= new Date(fromDate) && lastStreamedDate <= new Date(toDate);
        if (searchStr) {
          filterCnd = filterCnd && (song.song_name.toLowerCase().includes(searchStr) || song.artist_name.toLowerCase().includes(searchStr));
        }
        return filterCnd;
      })
      .reduce((acc, stream) => {
        const { song_id } = stream;
        if (!acc[song_id]) {
          acc[song_id] = 0;
        }
        acc[song_id]++;
        return acc;
      }, {});

    const totalData = data.streams
      ?.filter((stream) => {
        const streamDate = new Date(stream.stream_date);
        let filterCnd = streamDate >= new Date(fromDate) && streamDate <= new Date(toDate);
        if (revenueSource) {
          filterCnd = filterCnd && stream.revenue_source === revenueSource;
        }
        if (searchStr) {
          filterCnd =
            filterCnd && (stream.song_name.toLowerCase().includes(searchStr) || stream.artist_name.toLowerCase().includes(searchStr));
        }
        return filterCnd;
      })
      .sort((a, b) => {
        let compareA, compareB;

        if (sortBy === "date_streamed") {
          compareA = new Date(a.stream_date).getTime();
          compareB = new Date(b.stream_date).getTime();
        } else if (sortBy === "stream_count") {
          compareA = songFrequency[a.song_id] || 0;
          compareB = songFrequency[b.song_id] || 0;
        }

        return order === "asc" ? compareA - compareB : compareB - compareA;
      })
      .map((stream) => {
        return {
          song_name: stream.song_name,
          song_img: data.songs[stream.song_id - 1].cover,
          artist: stream.artist_name,
          artist_id: stream.artist_id,
          artist_img: data.artists[stream.artist_id - 1].avatar,
          stream_count: songFrequency[stream.song_id],
          user_id: stream.user_name,
          date_streamed: stream.stream_date,
          revenue: stream.revenue_source,
        };
      });

    const chartData = totalData.slice(page * 5, (page + 1) * 5);

    res.status(200).json({ chartData, totalDataCount: totalData.length, pageCount: Math.ceil(totalData.length / 5) });
  }
}
