import { useDataContext } from "@/context/DataContext";
import { ArtistProfile } from "./ArtistProfile";
import { DataTable } from "./DataTable";
import { Graphs } from "./Graphs";
import { Stats } from "./Stats";
import { Button } from "../ui/button";

export const StatsContainer = () => {
  const { artistId, loading, artist } = useDataContext();

  const updateUrlParams = (params: { [key: string]: string }) => {
    const queryString = new URLSearchParams(params).toString();
    const newUrl = `${window.location.pathname}${queryString && `?${queryString}`}`;

    window.history.pushState({}, "", newUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const onCrossProfile = () => {
    updateUrlParams({});
  };

  return (
    <div className={`block ${artistId ? "md:flex" : ""}`}>
      {artistId && !artist && !loading ? (
        <div className="text-3xl w-full">
          <h1 className="mb-4">No Artist Found</h1>
          <Button onClick={onCrossProfile}>Check Data for Every Artist</Button>
        </div>
      ) : (
        <>
          {artistId && <ArtistProfile />}
          <div className="flex-grow p-0 md:p-4 md:pt-[2px]">
            <Stats />
            <Graphs />
            <DataTable />
          </div>
        </>
      )}
    </div>
  );
};
