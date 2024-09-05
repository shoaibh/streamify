import { useDataContext } from "@/context/DataContext";
import { getMonthNamesBetweenDates } from "@/lib/utils";
import { AudioLines, DollarSign, TrendingDown, TrendingUp, UserRoundCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/customCard";
import { ProfileCard } from "../ui/ProfileCard";

export const Stats = () => {
  const { fromDate, toDate, loading, setLoading, artist } = useDataContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetch("/api/stats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toDate, fromDate, artistId: artist?.artist_id }),
    })
      .then((response) => response.json())
      .then((r) => {
        setData(r);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toDate, fromDate, setLoading, artist?.artist_id]);

  const monthBetweenDates = useMemo(() => {
    return getMonthNamesBetweenDates(`${fromDate}`, `${toDate}`);
  }, [fromDate, toDate]);

  const {
    totalUsers,
    usersGrowth,
    activeUsers,
    activeUsersLastMonth,
    totalRevenue,
    revenueThisMonth,
    topSong,
    topArtist,
    topArtistStreams,
    totalStreams,
    streamsThisMonth,
  } = data || {};

  const activeUsersNow = (activeUsers || 0) - (activeUsersLastMonth || 0);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
        {!artist?.artist_id && (
          <Card
            label="Total Users"
            count={totalUsers}
            growth={usersGrowth}
            Icon={Users}
            fill="#341fe0"
            loading={loading}
            BadgeIcon={TrendingUp}
            footer2={`${usersGrowth || "Loading..."} Users joined between ${monthBetweenDates[0]} and ${
              monthBetweenDates[monthBetweenDates.length - 1]
            }`}
            footer1={`Total ${totalUsers} Users have joined until ${monthBetweenDates[monthBetweenDates.length - 1]}`}
          />
        )}
        <Card
          label="Active Users"
          count={activeUsers}
          Icon={UserRoundCheck}
          growth={activeUsersNow}
          fill="#3a64c5"
          loading={loading}
          BadgeIcon={activeUsersNow > 0 ? TrendingUp : TrendingDown}
          footer1={`${activeUsers} Active Users in the last 30 days`}
          footer2={`${Math.abs(activeUsersNow)} ${activeUsersNow > 0 ? "more" : "less"} than the previous month`}
        />
        <Card
          label="Total Streams"
          count={totalStreams}
          growth={streamsThisMonth}
          Icon={AudioLines}
          fill="#bb0ff0"
          loading={loading}
          BadgeIcon={TrendingUp}
          footer2={`${streamsThisMonth} streams happened between ${monthBetweenDates[0]} and ${
            monthBetweenDates[monthBetweenDates.length - 1]
          }`}
          footer1={`Total ${totalStreams} streams until ${monthBetweenDates[monthBetweenDates.length - 1]}`}
        />
        <Card
          label="Revenue"
          count={totalRevenue}
          growth={revenueThisMonth}
          Icon={DollarSign}
          fill="#1be446"
          loading={loading}
          BadgeIcon={TrendingUp}
          footer2={`$${revenueThisMonth} in revenue was earned between ${monthBetweenDates[0]} and ${
            monthBetweenDates[monthBetweenDates.length - 1]
          }`}
          footer1={`Total $${totalRevenue} in revenue until ${monthBetweenDates[monthBetweenDates.length - 1]}`}
        />
        {!artist?.artist_id && (
          <ProfileCard
            label="Top Artist"
            name={topArtist?.artist_name}
            count={topArtistStreams || 0}
            loading={loading}
            topSong={topSong?.song_name}
            profilePic={topArtist?.avatar}
            artist_id={topArtist?.artist_id}
            footer1={`Most Streamed Artist between ${monthBetweenDates[0]} and ${monthBetweenDates[monthBetweenDates.length - 1]}`}
          />
        )}

        {artist?.artist_id && (
          <ProfileCard
            label="Top Song"
            name={topSong?.song_name}
            count={topArtistStreams || 0}
            loading={loading}
            topSong={topSong?.song_name}
            profilePic={topSong?.cover}
            isSong
            footer1={`Most Streamed Song between ${monthBetweenDates[0]} and ${monthBetweenDates[monthBetweenDates.length - 1]}`}
          />
        )}
      </div>
    </>
  );
};
