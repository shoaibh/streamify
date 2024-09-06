import { useState } from "react";
import { DateFilter } from "../dashboard";
import { SearchBox } from "./SearchBox";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header className="fixed top-0 p-4 left-0 w-full bg-white shadow-md shadow-gray-500/10 z-50 ">
      <div className="max-w-[1440px] items-center grid grid-cols-3 m-auto">
        <h1 className="col-start-2 col-span-1 justify-self-center md:col-start-1  mb-0 md:justify-self-start text-2xl">
          <img src="/logo.png" width={70} height={80} />
        </h1>
        <div
          className={`md:flex col-span-3 md:col-span-2 justify-between gap-5 transition-all duration-300 ease-in-out ${
            isOpen ? "h-[130px] mt-5 opacity-100" : "h-0 overflow-hidden opacity-0"
          } md:h-auto  md:mt-0 md:overflow-visible md:opacity-100`}
        >
          <SearchBox className="relative flex-1 md:max-w-[600px]" />
          <div className="col-start-3 justify-self-end mt-5 md:mt-0">
            <DateFilter />
          </div>
        </div>
        <div className="absolute top-3 right-3 md:hidden col-start-3 col-span-1 justify-self-end">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );
};
