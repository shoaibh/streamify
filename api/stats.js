import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "api", "data.json");
let data = null;

export default function handler(req, res) {
  if (req.method === "POST") {
    const { fromDate, toDate, artistId } = req.body;

    if (data === null) {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    const songFrequency = data?.streams
      ?.filter((song) => {
        const lastStreamedDate = new Date(song.stream_date);
        let filterCnd = lastStreamedDate >= new Date(fromDate) && lastStreamedDate <= new Date(toDate);

        if (artistId) {
          filterCnd = filterCnd && Number(song.artist_id) === Number(artistId);
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

    const usersGrowth = data?.users.filter((user) => {
      const dateJoined = new Date(user.date_joined);
      return dateJoined >= new Date(fromDate) && new Date(dateJoined) <= new Date(toDate);
    }).length;

    const totalUsers = data?.users.filter((user) => {
      const dateJoined = new Date(user.date_joined);
      return dateJoined <= new Date(toDate);
    }).length;

    const activeUsers = data?.users.filter((user) => {
      const lastStreamedDate = new Date(user.last_song_streamed);
      const currentDate = new Date();
      const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
      let filterCnd = lastStreamedDate >= lastMonthDate && lastStreamedDate <= currentDate;

      if (artistId) {
        filterCnd = filterCnd && Number(user.last_song_artist_id) === Number(artistId);
      }
      return filterCnd;
    }).length;

    const activeUsersLastMonth = data?.users.filter((user) => {
      const lastStreamedDate = new Date(user.last_song_streamed);
      const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
      const secondLastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 2));
      let filterCnd = lastStreamedDate >= secondLastMonthDate && lastStreamedDate <= lastMonthDate;

      if (artistId) {
        filterCnd = filterCnd && Number(user.last_song_artist_id) === Number(artistId);
      }
      return filterCnd;
    }).length;

    const totalRevenue = data?.revenue
      .filter((revenue) => {
        const revenueDate = new Date(revenue.revenue_date);
        let filterCnd = revenueDate <= new Date(toDate);
        if (artistId) {
          filterCnd = filterCnd && Number(revenue.artist_id) === Number(artistId);
        }
        return filterCnd;
      })
      .reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0)
      .toFixed(2);

    const revenueThisMonth = data?.revenue
      .filter((revenue) => {
        const revenueDate = new Date(revenue.revenue_date);
        let filterCnd = revenueDate >= new Date(fromDate) && revenueDate <= new Date(toDate);
        if (artistId) {
          filterCnd = filterCnd && Number(revenue.artist_id) === Number(artistId);
        }
        return filterCnd;
      })
      .reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0)
      .toFixed(2);

    let mostFrequentSongId = null;
    let maxFrequency = 0;

    for (const [song_id, frequency] of Object.entries(songFrequency || {})) {
      if (frequency > maxFrequency) {
        mostFrequentSongId = song_id;
        maxFrequency = frequency;
      }
    }

    const topSong = data?.songs.find((song) => {
      return song.song_id === Number(mostFrequentSongId);
    });

    const topArtistId = topSong?.artist_id;

    const topArtist = data?.artists.find((artist) => {
      return artist?.artist_id === Number(topArtistId);
    });

    const totalStreams = data.streams?.filter((stream) => {
      const streamDate = new Date(stream.stream_date);
      let filterCnd = streamDate <= new Date(toDate);
      if (artistId) {
        filterCnd = filterCnd && Number(stream.artist_id) === Number(artistId);
      }
      return filterCnd;
    }).length;

    const streamsThisMonth = data.streams?.filter((stream) => {
      const streamDate = new Date(stream.stream_date);
      let filterCnd = streamDate >= new Date(fromDate) && streamDate <= new Date(toDate);
      if (artistId) {
        filterCnd = filterCnd && Number(stream.artist_id) === Number(artistId);
      }
      return filterCnd;
    }).length;

    res.status(200).json({
      usersGrowth,
      totalUsers,
      activeUsers,
      activeUsersLastMonth,
      totalRevenue,
      revenueThisMonth,
      topArtist,
      topSong,
      totalStreams,
      streamsThisMonth,
      songFrequency,
      topArtistStreams: maxFrequency,
    });
  }
}
