import { CustomTable } from "../table/Table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useDataContext } from "@/context/DataContext";
import { useMemo } from "react";
import { getMonthNamesBetweenDates } from "@/lib/utils";

type Stream = {
  song_name: string;
  artist: string;
  date_streamed: string;
  stream_count: string;
  user_id: string;
};

const columns: ColumnDef<Stream>[] = [
  {
    accessorKey: "song_name",
    header: "Song Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("song_name")}</div>,
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => <div className="capitalize">{row.getValue("artist")}</div>,
  },
  {
    accessorKey: "date_streamed",
    header: ({ column }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Date Streamed
                {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{column.getIsSorted() === "asc" ? <p>sort in descending</p> : <p>sort in ascending</p>}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("date_streamed")}</div>,
  },
  {
    accessorKey: "stream_count",
    header: ({ column }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Stream Count
                {column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{column.getIsSorted() === "asc" ? <p>sort in descending</p> : <p>sort in ascending</p>}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("stream_count")}</div>,
  },
  {
    accessorKey: "user_id",
    header: "User",
    cell: ({ row }) => <div className="capitalize">{row.getValue("user_id")}</div>,
  },
  {
    accessorKey: "revenue",
    header: "Revenue Generated Through",
    cell: ({ row }) => <div className="capitalize">{row.getValue("revenue")}</div>,
  },
];

export const DataTable = () => {
  const { data, fromDate, toDate, songFrequency, revenueSource } = useDataContext();

  const chartData = useMemo(() => {
    return data.streams
      .filter((stream) => {
        const streamDate = new Date(stream.stream_date);
        const dateCheck = streamDate >= fromDate && streamDate <= toDate;
        if (revenueSource) {
          return dateCheck && stream.revenue_source === revenueSource;
        }
        return dateCheck;
      })
      .sort((a, b) => {
        const bStreamDate = new Date(b.stream_date);
        const aStreamDate = new Date(a.stream_date);
        return bStreamDate - aStreamDate;
      })
      .map((stream) => {
        return {
          song_name: stream.song_name,
          artist: stream.artist_name,
          stream_count: songFrequency[stream.song_id],
          user_id: stream.user_name,
          date_streamed: stream.stream_date,
          revenue: stream.revenue_source,
        };
      });
  }, [data.streams, fromDate, revenueSource, songFrequency, toDate]);

  const totalDesc = useMemo(() => {
    const months = getMonthNamesBetweenDates(fromDate, toDate);

    return `${revenueSource ? ` (${revenueSource}) ` : ""}between ${months[0]} and ${months[months.length - 1]}`;
  }, [fromDate, revenueSource, toDate]);

  return (
    <>
      <CustomTable<Stream>
        columns={columns}
        inputPlaceholder="search with song name or artist"
        inputFiler="song_name"
        inputFiler2="artist"
        data={chartData}
        totalDesc={totalDesc}
      />
    </>
  );
};
