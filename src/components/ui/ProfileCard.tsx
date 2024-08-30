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
};

export const ProfileCard: FC<Props> = ({ label, profilePic, name, count, topSong, footer1, loading }) => {
  return (
    <div className="w-full aspect-video relative border-gray-200 border rounded-sm shadow-md shadow-gray-500/10 ">
      <h1 className="text-2xl my-3">{label}</h1>
      <div className="md:flex justify-between items-center px-4 mb-5">
        {loading && <CustomLoader />}

        <img src={profilePic} alt={name} className="m-auto mb-3 md:mb-0 md:m-0 rounded-full aspect-square w-[40%]" />

        {!loading && (
          <div className="flex flex-col gap-2">
            <h2 className="text-[clamp(1rem,3vw,1.5rem)]">{name}</h2>
            <h2 className="text-xs">
              <span className="text-gray-600 ">Song: </span>
              {topSong}
            </h2>
            <h2 className="text-xs">{count} Streams</h2>
          </div>
        )}
      </div>
      <div className="flex-col transform mb-5 items-center gap-2 px-4 text-[clamp(0.5rem,5vw,0.95rem)]">
        <div className="flex justify-center   gap-2 font-medium leading-none">{footer1}</div>
      </div>
    </div>
  );
};
