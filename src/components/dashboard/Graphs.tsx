import { RevenueGraph } from "./RevenueGraph";
import { SongGraph } from "./SongGraph";
import { UserGraph } from "./UserGraph";

export const Graphs = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
      <UserGraph />
      <RevenueGraph />
      <SongGraph />
    </div>
  );
};
