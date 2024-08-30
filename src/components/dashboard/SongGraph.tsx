import { useDataContext } from "@/context/DataContext";
import { BarGraph } from "../graph/BarGraph";
import { ChartConfig } from "../ui/chart";
import { useMemo } from "react";
import { monthNames } from "@/lib/utils";

const chartBarConfig = {
  songName: {
    label: "Song Name",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export const SongGraph = () => {
  const { data, fromDate, toDate, songFrequency, loading } = useDataContext();

  const chartData = useMemo(() => {
    if (!data || loading) {
      return {};
    }
    const songEntries = Object.entries(songFrequency);

    songEntries.sort((a, b) => b[1] - a[1]);

    const top5Songs = songEntries.slice(0, 5);

    const result: Array<{ songName: string; streams: number }> = [];

    top5Songs.forEach((song_id) => {
      const song = data.songs.find((song) => {
        return song.song_id === Number(song_id[0]);
      });
      if (song) result.push({ songName: song.song_name, streams: song_id[1] });
    });
    return result;
  }, [data, loading, songFrequency]);

  return (
    <BarGraph
      header="Top 5 stream songs"
      description={`Top songs streamed from ${monthNames[fromDate?.getMonth()]} to ${monthNames[toDate?.getMonth()]}`}
      chartConfig={chartBarConfig}
      chartData={chartData}
      xAxixKey="streams"
      yAxisKey="songName"
    />
  );
};
