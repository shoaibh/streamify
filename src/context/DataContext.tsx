import { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { generateMockData } from "@/lib/utils";

const songData = generateMockData();

type ContextType = {
  fromDate: Date;
  setFromDate: React.Dispatch<React.SetStateAction<Date>>;
  toDate: Date;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  data: typeof songData;
};

const DataContext = createContext<ContextType>({} as ContextType);

export const DataContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(new Date(currentDate.setMonth(currentDate.getMonth() - 7)));
  const [toDate, setToDate] = useState(new Date());

  //   const filteredSongs = useMemo(() => {
  //     return data.songs.filter((song) => {
  //       const songDate = new Date(song.date_streamed);
  //       console.log({ songDate, fromDate, toDate });
  //       return songDate >= new Date(fromDate) && songDate <= new Date(toDate);
  //     });
  //   }, [fromDate, toDate]);

  //   console.log(filteredSongs);

  console.log(songData);

  return <DataContext.Provider value={{ fromDate, setFromDate, toDate, setToDate, data: songData }}>{children}</DataContext.Provider>;
};

export const useDataContext = () => useContext(DataContext);
