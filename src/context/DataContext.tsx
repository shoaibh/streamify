import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

type SongFrequency = Record<string, number>;

type Stream = Array<{
  id: number;
  song_id: number;
  song_name: string;
  artist_name: string;
  user_id: number;
  user_name: string;
  stream_date: string;
  revenue_source: string;
}>;

type Data = {
  users: Array<{
    user_id: number;
    user_name: string;
    date_joined: string;
    last_song_streamed: string;
  }>;
  artists: Array<{
    artist_id: number;
    artist_name: string;
    joined_date: string;
    avatar: string;
  }>;
  songs: Array<{
    song_id: number;
    artist_id: number;
    date_streamed: string;
    song_name: string;
  }>;
  revenue: Array<{
    revenue_date: "string";
    subscription_revenue: number;
    ad_revenue: number;
  }>;
  streams: Stream;
};

type ContextType = {
  fromDate: Date;
  setFromDate: React.Dispatch<React.SetStateAction<Date>>;
  toDate: Date;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  data?: Data;
  streamData: Stream;
  songFrequency: SongFrequency;
  revenueSource: string;
  setRevenueSource: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const DataContext = createContext<ContextType>({} as ContextType);

export const DataContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(new Date(currentDate.setMonth(currentDate.getMonth() - 12)));
  const [toDate, setToDate] = useState(new Date());
  const [revenueSource, setRevenueSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [songData, setSongData] = useState<Data | undefined>(undefined);
  const [streamData, setStreamData] = useState<Stream>([]);

  useEffect(() => {
    const worker = new Worker(new URL("@/lib/mockDataWorker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (event) => {
      const { type, data } = event.data;

      if (type === "metadata") {
        setSongData((prevData) => ({ ...prevData, ...data }));
      } else if (type === "chunk") {
        setStreamData((prevData) => [...prevData, ...data]);
      } else if (type === "complete") {
        setLoading(false);
        worker.terminate();
      }
    };

    worker.postMessage(null);

    return () => worker.terminate();
  }, []);

  const songFrequency = useMemo<SongFrequency>(() => {
    if (loading) {
      return {};
    }
    return streamData
      ?.filter((song) => {
        const lastStreamedDate = new Date(song.stream_date);
        return lastStreamedDate >= fromDate && lastStreamedDate <= toDate;
      })
      .reduce((acc: SongFrequency, stream) => {
        const { song_id } = stream;
        if (!acc[song_id]) {
          acc[song_id] = 0;
        }
        acc[song_id]++;
        return acc;
      }, {});
  }, [fromDate, loading, streamData, toDate]);

  const contextValue = useMemo(() => {
    return {
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      data: songData,
      streamData,
      songFrequency,
      setRevenueSource,
      revenueSource,
      loading,
      setLoading,
    };
  }, [fromDate, toDate, songData, streamData, songFrequency, revenueSource, loading]);

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
