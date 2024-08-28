import { useDataContext } from "@/context/DataContext";
import { Card } from "../ui/customCard";
import { useMemo } from "react";
import { AudioLines, DollarSign, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import { getMonthNamesBetweenDates, monthNames } from "@/lib/utils";
import { ProfileCard } from "../ui/ProfileCard";

export const Stats = () => {
  const { data, fromDate, toDate, songFrequency } = useDataContext();

  const {
    totalUsers,
    usersGrowth,
    activeUsers,
    activeUsersLastMonth,
    totalStreams,
    streamsThisMonth,
    totalRevenue,
    revenueThisMonth,
    topSong,
    topArtist,
    topArtistStreams,
  } = useMemo(() => {
    const usersGrowth = data.users.filter((user) => {
      const dateJoined = new Date(user.date_joined);
      return dateJoined >= fromDate && dateJoined <= toDate;
    });

    const totalUsers = data.users.filter((user) => {
      const dateJoined = new Date(user.date_joined);
      return dateJoined <= toDate;
    });

    const activeUsers = data.users.filter((user) => {
      const lastStreamedDate = new Date(user.last_song_streamed);
      const currentDate = new Date();
      const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
      return lastStreamedDate >= lastMonthDate && lastStreamedDate <= currentDate;
    });

    const activeUsersLastMonth = data.users.filter((user) => {
      const lastStreamedDate = new Date(user.last_song_streamed);
      const lastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
      const secondLastMonthDate = new Date(new Date().setMonth(new Date().getMonth() - 2));
      return lastStreamedDate >= secondLastMonthDate && lastStreamedDate <= lastMonthDate;
    });

    const totalStreams = data.streams.filter((stream) => {
      const streamDate = new Date(stream.stream_date);
      return streamDate <= toDate;
    });

    const streamsThisMonth = data.streams.filter((stream) => {
      const streamDate = new Date(stream.stream_date);
      return streamDate >= fromDate && streamDate <= toDate;
    });

    const totalRevenue = data.revenue
      .filter((revenue) => {
        const revenueDate = new Date(revenue.revenue_date);
        return revenueDate <= toDate;
      })
      .reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0);

    const revenueThisMonth = data.revenue
      .filter((revenue) => {
        const revenueDate = new Date(revenue.revenue_date);
        return revenueDate >= fromDate && revenueDate <= toDate;
      })
      .reduce((acc, curr) => acc + curr.subscription_revenue + curr.ad_revenue, 0);

    // Step 3: Find the song_id with the maximum frequency
    let mostFrequentSongId = null;
    let maxFrequency = 0;

    for (const [song_id, frequency] of Object.entries(songFrequency)) {
      if (frequency > maxFrequency) {
        mostFrequentSongId = song_id;
        maxFrequency = frequency;
      }
    }

    const topSong = data.songs.find((song) => {
      return song.song_id === Number(mostFrequentSongId);
    });

    const topArtistId = topSong?.artist_id;

    const topArtist = data.artists.find((artist) => {
      return artist?.artist_id === Number(topArtistId);
    });
    return {
      totalUsers: totalUsers.length,
      usersGrowth: usersGrowth.length,
      activeUsers: activeUsers.length,
      activeUsersLastMonth: activeUsersLastMonth.length,
      totalStreams: totalStreams.length,
      streamsThisMonth: streamsThisMonth.length,
      revenueThisMonth: revenueThisMonth.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      topSong,
      topArtist,
      topArtistStreams: maxFrequency,
    };
  }, [data.artists, data.revenue, data.songs, data.streams, data.users, fromDate, songFrequency, toDate]);

  const monthBetweenDates = useMemo(() => {
    return getMonthNamesBetweenDates(`${fromDate}`, `${toDate}`);
  }, [fromDate, toDate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <Card
        label="Total Users"
        count={totalUsers}
        growth={usersGrowth}
        Icon={Users}
        fill="#341fe0"
        BadgeIcon={TrendingUp}
        footer1={`${usersGrowth} Users joined between ${monthBetweenDates[0]} and ${monthBetweenDates[monthBetweenDates.length - 1]}`}
        footer2={`Total ${totalUsers} Users have joined until ${monthBetweenDates[monthBetweenDates.length - 1]}`}
      />
      <Card
        label="Active Users"
        count={activeUsers}
        Icon={UserRoundCheck}
        growth={activeUsers - activeUsersLastMonth}
        fill="#3a64c5"
        BadgeIcon={TrendingUp}
        footer1={`${activeUsers} Active Users in the last 30 days`}
        footer2={`${activeUsers - activeUsersLastMonth} more than the previous month`}
      />
      <Card
        label="Total Streams"
        count={totalStreams}
        growth={streamsThisMonth}
        Icon={AudioLines}
        fill="#bb0ff0"
        BadgeIcon={TrendingUp}
        footer1={`${streamsThisMonth} streams happened between ${monthBetweenDates[0]} and ${
          monthBetweenDates[monthBetweenDates.length - 1]
        }`}
        footer2={`Total ${totalStreams} streams until ${monthBetweenDates[monthBetweenDates.length - 1]}`}
      />
      <Card
        label="Revenue"
        count={totalRevenue}
        growth={revenueThisMonth}
        Icon={DollarSign}
        fill="#1be446"
        BadgeIcon={TrendingUp}
        footer1={`$${revenueThisMonth} in revenue was earned between ${monthBetweenDates[0]} and ${
          monthBetweenDates[monthBetweenDates.length - 1]
        }`}
        footer2={`Total $${totalRevenue} in revenue until ${monthBetweenDates[monthBetweenDates.length - 1]}`}
      />
      <ProfileCard
        label="Top Artist"
        name={topArtist?.artist_name}
        count={topArtistStreams}
        topSong={topSong?.song_name}
        profilePic={topArtist?.avatar}
        footer1={`Most Streamed Artist between ${monthBetweenDates[0]} and ${monthBetweenDates[monthBetweenDates.length - 1]}`}
      />
    </div>
  );
};
