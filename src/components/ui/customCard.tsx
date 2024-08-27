import { FC } from "react";

type Props = {
  label: string;
  count: string;
  growth?: string;
  icon?: string;
  profilePic?: string;
  name?: string;
};

export const Card: FC<Props> = ({ label, count, growth, profilePic, name }) => {
  return (
    <div className="w-full aspect-video relative border-gray-500 border rounded-sm">
      {profilePic && <img src={profilePic} alt={name} />}
      <h1>{count}</h1>
      <h2>{label}</h2>
      <span className="absolute top-1 right-2">{growth}</span>
    </div>
  );
};
