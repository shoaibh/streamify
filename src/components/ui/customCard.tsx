import { ComponentType, FC, SVGProps } from "react";
import CustomLoader from "./CustomLoader";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

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
  console.log({ growth: growth?.toString() });
  return (
    <div className="w-full aspect-[16/12] grid grid-rows-3 relative border-gray-200 border rounded-sm shadow-md shadow-gray-500/10 ">
      <div className="relative">
        <Icon stroke={fill} className="absolute top-2 left-2" />
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <div
                className={`cursor-default absolute z-10 top-2 right-3 flex gap-2 items-center 
                  rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors 
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
                  border-transparent hover:opacity-50 ${
                    growth && Number(growth) >= 0 ? "bg-[#6cf4be] text-[#146343]" : "bg-[#FB9B88] text-[#AA2106]"
                  }  ${badgeClassname}`}
              >
                {loading && <CustomLoader />}
                {!loading && (
                  <>
                    <BadgeIcon />
                    {growth}
                  </>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="">
              {footer2}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid place-content-center ">
        <h1 className="text-4xl md:text-3xl">{loading ? <CustomLoader /> : count}</h1>
        <h2 className="text-gray-400">{label}</h2>
      </div>

      <div className="flex-col self-center items-center gap-2 px-3 text-xl lg:text-[clamp(0.75rem,1vw+0.3rem,1rem)] xl:text-sm">
        <div className="flex justify-center  mb-3 gap-2 leading-none">{footer1}</div>
      </div>
    </div>
  );
};
