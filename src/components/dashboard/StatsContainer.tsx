import { useDataContext } from "@/context/DataContext";
import { DataTable } from "./DataTable";
import { Graphs } from "./Graphs";
import { Stats } from "./Stats";
import { X } from "lucide-react";

export const StatsContainer = () => {
  const { artist, artistId, topSongs } = useDataContext();
  const joinedDate = new Date(artist?.joined_date).toDateString().split(" ").slice(1).join(" ");

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
      {artistId && (
        <div className="mx-0 md:min-w-[25vw] lg:min-w-[20vw] max-h-[calc(100vh-134px)] overflow-scroll relative flex justify-evenly my-4 md:m-0 md:block md:sticky md:top-[114px] rounded border border-gray-200 p-4">
          <button
            onClick={onCrossProfile}
            className="absolute top-2 right-2 inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <X className="block h-6 w-6" />
          </button>
          <div className="grid">
            <img
              src={artist?.avatar}
              alt={artist?.artist_name}
              className="m-auto mb-3 md:mb-0  rounded-full aspect-square w-[100px] md:w-[70%]"
            />
            <div>
              {" "}
              <h2 className="text-[clamp(1rem,1vw+0.5rem,1.5rem)]">{artist?.artist_name}</h2>
              <span className="text-gray-500 text-[clamp(0.75rem,1vw+0.2rem,1rem)]">Joined: {joinedDate}</span>
            </div>
          </div>
          <div>
            {" "}
            <h3 className="text-xs mb-2 justify-start mt-3 text-gray-600">Top Songs</h3>
            <ul>
              {topSongs?.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (song: any) => (
                  <li
                    key={song.songName}
                    className="flex gap-4 mb-3 rounded hover:bg-violet-50 items-center  p-3 border border-violet-300 border-solid"
                  >
                    <img src={song.cover} alt={song?.songName} className="rounded-full aspect-square w-7" />{" "}
                    <span className="text-[clamp(0.75rem,0.7vw+0.2rem,1rem)] text-start">
                      {song.songName} <br /> ({song.streams} streams)
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
      <div className="flex-grow p-0 md:p-4 md:pt-[2px]">
        <Stats />
        <Graphs />
        <DataTable />
      </div>
    </div>
  );
};
