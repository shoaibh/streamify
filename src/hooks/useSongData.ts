import { useDataContext } from "@/context/DataContext";
import { useMemo } from "react";

export const useSongData = () => {
  const { data, fromDate, toDate } = useDataContext();

  console.log("checking");

  const {
    totalUsers,
    usersThisMonth,
    activeUsers,
    totalStreams,
    streamsThisMonth,
    totalRevenue,
    revenueThisMonth,
    topArtist,
    topArtistStreams,
    songFrequency,
  } = useMemo(() => {
    console.log("inside");
    const usersThisMonth = data.users.filter((user) => {
      const dateJoined = new Date(user.date_joined);
      return dateJoined >= fromDate && dateJoined <= toDate;
    });

    const activeUsers = data.users.filter((user) => {
      const lastStreamedDate = new Date(user.last_song_streamed);
      return lastStreamedDate >= fromDate && lastStreamedDate <= toDate;
    });

    const streamsThisMonth = data.streams.filter((stream) => {
      const streamDate = new Date(stream.stream_date);
      return streamDate >= fromDate && streamDate <= toDate;
    });

    const totalRevenue = data.revenue.reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0);

    const revenueThisMonth = data.revenue
      .filter((revenue) => {
        const revenueDate = new Date(revenue.revenue_date);
        return revenueDate >= fromDate && revenueDate <= toDate;
      })
      .reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0);

    const songFrequency = data.streams
      .filter((song) => {
        const lastStreamedDate = new Date(song.stream_date);
        return lastStreamedDate >= fromDate && lastStreamedDate <= toDate;
      })
      .reduce((acc, stream) => {
        const { song_id } = stream;
        if (!acc[song_id]) {
          acc[song_id] = 0;
        }
        acc[song_id]++;
        return acc;
      }, {});

    // Step 3: Find the song_id with the maximum frequency
    let mostFrequentSongId = null;
    let maxFrequency = 0;

    for (const [song_id, frequency] of Object.entries(songFrequency)) {
      if (frequency > maxFrequency) {
        mostFrequentSongId = song_id;
        maxFrequency = frequency;
      }
    }

    const topArtistId = data.songs.find((song) => {
      return song.song_id === Number(mostFrequentSongId);
    }).artist_id;

    const topArtist = data.artists.find((artist) => {
      return artist.artist_id === Number(topArtistId);
    });
    return {
      totalUsers: data.users.length,
      usersThisMonth: usersThisMonth.length,
      activeUsers: activeUsers.length,
      totalStreams: data.streams.length,
      streamsThisMonth: streamsThisMonth.length,
      revenueThisMonth: revenueThisMonth.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      songFrequency,
      topArtist,
      topArtistStreams: maxFrequency,
    };
  }, [data, fromDate, toDate]);

  return {
    totalUsers,
    usersThisMonth,
    activeUsers,
    totalStreams,
    streamsThisMonth,
    totalRevenue,
    revenueThisMonth,
    songFrequency,
    topArtist,
    topArtistStreams,
  };
};
