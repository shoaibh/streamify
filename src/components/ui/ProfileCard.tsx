import { FC } from "react";
import CustomLoader from "./CustomLoader";

type Props = {
  label: string;
  count: string | number;
  profilePic?: string;
  name?: string;
  topSong?: string;
  footer1?: string;
  loading?: boolean;
  isSong?: boolean;
  artist_id?: string;
};

export const ProfileCard: FC<Props> = ({ label, isSong = false, artist_id, profilePic, name, count, topSong, footer1, loading }) => {
  const updateUrlParams = (params: { [key: string]: string }) => {
    const queryString = new URLSearchParams(params).toString();
    const newUrl = `${window.location.pathname}${queryString && `?${queryString}`}`;

    window.history.pushState({}, "", newUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const onCardClick = () => {
    if (isSong || !artist_id) return;
    const params = { artist_id };
    updateUrlParams(params);
  };

  return (
    <div
      className={`w-full aspect-[16/12] grid grid-rows-8 relative border-gray-200 border rounded-sm shadow-md shadow-gray-500/10 ${
        artist_id ? "cursor-pointer hover:bg-gray-100" : ""
      }`}
      onClick={onCardClick}
    >
      <h1 className="text-2xl md:text-3xl lg:text-2xl row-span-2 self-center">{label}</h1>
      <div className="flex gap-10 row-span-3 xl:gap-5 justify-evenly items-center px-4">
        {loading && <CustomLoader />}

        <img src={profilePic} alt={name} className="mb-3 md:mb-0 md:m-0 rounded-full aspect-square w-[30%]" />

        {!loading && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl lg:text-[clamp(1rem,1vw+0.5rem,1.5rem)]">{name}</h2>
            {!isSong && (
              <h2 className="text-xl lg:text-[clamp(0.75rem,1vw+0.5rem,1.25rem)]">
                <span className="text-gray-600">Song: {topSong}</span>
              </h2>
            )}
            <h2 className="text-xl lg:text-[clamp(0.75rem,1vw+0.5rem,1rem)] text-gray-400">({count} Streams)</h2>
          </div>
        )}
      </div>
      <div className="flex-col row-span-3 self-center items-center gap-2 px-4 text-xl lg:text-[clamp(0.75rem,1vw+0.3rem,1rem)] xl:text-sm">
        <div className="flex justify-center   gap-2 leading-none">{footer1}</div>
      </div>
    </div>
  );
};
