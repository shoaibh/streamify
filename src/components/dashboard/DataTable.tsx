import { useDataContext } from "@/context/DataContext";
import { getMonthNamesBetweenDates, updateUrlParams } from "@/lib/utils";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CustomTable } from "../table/Table";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useDebounce } from "@/hooks/useDebounce";

type Stream = {
  song_name: string;
  song_img: string;
  artist: string;
  artist_id: string;
  artist_img: string;
  date_streamed: string;
  stream_count: number;
  user_id: string;
  revenue: string;
};

const columns: ColumnDef<Stream>[] = [
  {
    accessorKey: "song_name",
    header: "Song Name",
    cell: ({ row }) => {
      return (
        <div className="flex gap-3 items-center text-sm text-start capitalize">
          <img src={row.original.song_img} alt={row.getValue("song_name")} className="rounded-full aspect-square w-6" />
          {row.getValue("song_name")}
        </div>
      );
    },
    maxSize: 100,
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => {
      const onClick = () => {
        const params = { artist_id: row.original.artist_id };
        updateUrlParams(params);
      };
      return (
        <div className="flex gap-3 items-center text-sm text-start capitalize" onClick={onClick}>
          <img src={row.original.artist_img} alt={row.getValue("song_name")} className="rounded-full aspect-square w-6" />
          <span className="text-blue-400 hover:text-blue-600 cursor-pointer">{row.getValue("artist")}</span>
        </div>
      );
    },
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
    cell: ({ row }) => {
      const date_streamed = new Date(row.getValue("date_streamed")).toDateString().split(" ").slice(1).join(" ");

      return <div>{date_streamed}</div>;
    },
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
  const { fromDate, toDate, revenueSource, artist, loading, artistId } = useDataContext();

  const [chartData, setChartData] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [searchStr, setSearchStr] = useState<string | undefined>("");

  useEffect(() => {
    if (artist) setSearchStr(artist.artist_name);
    else setSearchStr("");
  }, [artist]);

  const debouncedValue = useDebounce<string | undefined>(searchStr, 300);

  useEffect(() => {
    // Make a request to the serverless function
    if (loading) return;
    setDataLoading(true);
    fetch("/api/dataTable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toDate,
        fromDate,
        revenueSource,
        page: pagination.pageIndex,
        sortBy: sorting?.[0]?.id,
        order: sorting?.[0]?.desc === undefined ? "desc" : sorting?.[0]?.desc || "asc",
        searchStr: debouncedValue || artist?.artist_name,
      }),
    })
      .then((response) => response.json())
      .then((r) => {
        setChartData(r.chartData);
        setTotalDataCount(r.totalDataCount);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setDataLoading(false);
      });
  }, [toDate, fromDate, revenueSource, pagination.pageIndex, sorting, debouncedValue, artist?.artist_name, loading]);

  const totalDesc = useMemo(() => {
    const months = getMonthNamesBetweenDates(fromDate, toDate);

    return `${revenueSource ? ` (${revenueSource}) ` : ""}between ${months[0]} and ${months[months.length - 1]}`;
  }, [fromDate, revenueSource, toDate]);

  const isLoading = dataLoading || loading;

  return (
    <>
      <CustomTable<Stream>
        columns={columns}
        inputPlaceholder="search with song name or artist"
        inputFiler="song_name"
        inputFiler2="artist"
        data={chartData}
        totalDesc={totalDesc}
        pagination={pagination}
        setPagination={setPagination}
        totalDataCount={totalDataCount}
        sorting={sorting}
        setSorting={setSorting}
        searchStr={searchStr}
        setSearchStr={setSearchStr}
        artistId={artistId}
        isLoading={isLoading}
      />
    </>
  );
};
