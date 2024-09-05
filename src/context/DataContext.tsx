import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

type ContextType = {
  fromDate: Date;
  setFromDate: React.Dispatch<React.SetStateAction<Date>>;
  toDate: Date;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  revenueSource: string;
  setRevenueSource: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  artist: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  topSongs: any;
  artistId: string | null;
};

const DataContext = createContext<ContextType>({} as ContextType);

export const DataContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(new Date(currentDate.setMonth(currentDate.getMonth() - 12)));
  const [toDate, setToDate] = useState(new Date());
  const [revenueSource, setRevenueSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [artistId, setArtistId] = useState<string | null>(new URLSearchParams(window.location.search).get("artist_id"));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [artist, setArtist] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topSongs, setTopSongs] = useState<any>([]);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      setArtistId(params.get("artist_id"));
    };

    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  useEffect(() => {
    fetch("/api/getArtist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: artistId }),
    })
      .then((response) => response.json())
      .then((r) => {
        setArtist(r.artist);
        setTopSongs(r.songResult);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [artistId]);

  const contextValue = useMemo(() => {
    return {
      fromDate,
      setFromDate,
      toDate,
      setToDate,
      setRevenueSource,
      revenueSource,
      loading,
      setLoading,
      artist,
      artistId,
      topSongs,
    };
  }, [fromDate, toDate, revenueSource, loading, artist, artistId, topSongs]);

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
