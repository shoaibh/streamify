import { useEffect, useState } from "react";
import { RevenueGraph } from "./RevenueGraph";
import { SongGraph } from "./SongGraph";
import { UserGraph } from "./UserGraph";
import { useDataContext } from "@/context/DataContext";

export const Graphs = () => {
  const { fromDate, toDate, setLoading, artist } = useDataContext();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userGraphData, setUserGraphData] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pieChartData, setPieChartData] = useState<any>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [songChartData, setSongChartData] = useState<any>([]);

  useEffect(() => {
    fetch("/api/graphData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ toDate, fromDate, artistId: artist?.artist_id }),
    })
      .then((response) => response.json())
      .then((r) => {
        setUserGraphData(r?.userGraphData || []);
        setSongChartData(r?.chartData || []);
        setPieChartData({ totalRevenue: r.totalRevenue, subsRevenue: r.subsRevenue, adsRevenue: r.adsRevenue });
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toDate, fromDate, setLoading, artist?.artist_id]);

  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5`}>
        {!artist?.artist_id && <UserGraph userGraphData={userGraphData} />}
        <RevenueGraph pieChartData={pieChartData} />
        <SongGraph songChartData={songChartData} />
      </div>
    </>
  );
};
