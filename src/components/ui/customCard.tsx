import { ComponentType, FC, SVGProps } from "react";
import { Badge } from "./badge";
import CustomLoader from "./CustomLoader";

type Props = {
  label: string;
  count?: string | number;
  growth?: string | number;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  BadgeIcon: ComponentType<SVGProps<SVGSVGElement>>;
  profilePic?: string;
  name?: string;
  fill?: string;
  badgeClassname?: string;
  footer1?: string;
  footer2?: string;
  loading?: boolean;
};

export const Card: FC<Props> = ({ label, count = 0, growth, Icon, BadgeIcon, fill, badgeClassname, footer1, footer2, loading }) => {
  return (
    <div className="w-full aspect-video relative border-gray-200 border rounded-sm shadow-md shadow-gray-500/10 ">
      <Icon stroke={fill} className="absolute top-2 left-2" />
      <Badge
        className={` absolute top-2 right-3 flex gap-2 text ${
          growth && Number(growth) > 0 ? "bg-[#ecf6f2] text-[#60c76e]" : "#FB9B88 #AA2106"
        }  ${badgeClassname}`}
      >
        {loading && <CustomLoader />}
        {!loading && (
          <>
            <BadgeIcon />
            {growth}
          </>
        )}
      </Badge>
      <div className="grid place-content-center h-full">
        <h1 className="text-2xl">{loading ? <CustomLoader /> : count}</h1>
        <h2 className="text-gray-400">{label}</h2>
      </div>

      <div className="flex-col transform -translate-y-[30px] items-center gap-2 px-3 text-[clamp(0.5rem,2vw,0.75rem)]">
        <div className="flex justify-center  mb-3 gap-2 font-medium leading-none">{footer1}</div>
        {footer2 && <div className="leading-none text-muted-foreground">{footer2}</div>}
      </div>
    </div>
  );
};
