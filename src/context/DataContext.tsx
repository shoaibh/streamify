import { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from "react";
import { generateMockData } from "@/lib/utils";

const songData = generateMockData();

type ContextType = {
  fromDate: Date;
  setFromDate: React.Dispatch<React.SetStateAction<Date>>;
  toDate: Date;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  data: typeof songData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  songFrequency: any;
  revenueSource: string;
  setRevenueSource: React.Dispatch<React.SetStateAction<string>>;
};

const DataContext = createContext<ContextType>({} as ContextType);

export const DataContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(new Date(currentDate.setMonth(currentDate.getMonth() - 12)));
  const [toDate, setToDate] = useState(new Date());
  const [revenueSource, setRevenueSource] = useState("");

  const songFrequency = useMemo(
    () =>
      songData.streams
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
        }, {}),
    [fromDate, toDate]
  );

  const contextValue = useMemo(() => {
    return { fromDate, setFromDate, toDate, setToDate, data: songData, songFrequency, setRevenueSource, revenueSource };
  }, [fromDate, songFrequency, toDate, revenueSource]);

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
