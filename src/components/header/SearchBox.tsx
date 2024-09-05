import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import CustomLoader from "../ui/CustomLoader";

export const SearchBox = ({ className }: { className: string }) => {
  const [loading, setLoading] = useState(false);
  const [searchStr, setSearchStr] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [suggestions, setSuggestions] = useState<any>(["asdfs", "asdfdsf"]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [top5suggestions, setTop5Suggestions] = useState<any>();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedValue = useDebounce<string | undefined>(searchStr, 300);

  useEffect(() => {
    if (!showSuggestions) return;
    setLoading(true);
    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchStr: debouncedValue }),
    })
      .then((response) => response.json())
      .then((r) => {
        setTop5Suggestions(r.artistResult);
        setSuggestions(r.searchedArtist);
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedValue, setLoading, showSuggestions]);

  const updateUrlParams = (params: { [key: string]: string }) => {
    const queryString = new URLSearchParams(params).toString();
    const newUrl = `${window.location.pathname}${queryString && `?${queryString}`}`;

    window.history.pushState({}, "", newUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSelect = (suggestion: any) => {
    const params = { artist_id: suggestion.artist_id };
    updateUrlParams(params);
    setShowSuggestions(false);
    setSearchStr(suggestion.artist_name);
    inputRef.current?.blur();
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      updateUrlParams({});
      inputRef.current?.blur();
    }
    setSearchStr(event.currentTarget.value);
  };

  const suggestionsToShow = useMemo(() => {
    if (searchStr) {
      return suggestions;
    }
    return top5suggestions;
  }, [searchStr, suggestions, top5suggestions]);

  return (
    <div className={className}>
      <Input
        type="search"
        className="col-start-2 p-3"
        placeholder="Search your favourite artist"
        onChange={handleInput}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
        value={searchStr}
        ref={inputRef}
      />
      {showSuggestions && (
        <ul className="border border-gray-300 mt-2 max-h-[300px] overflow-scroll bg-white w-full absolute z-10">
          <span className="text-xs text-gray-500">Top Suggestions</span>
          {loading && <CustomLoader />}
          {suggestionsToShow?.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (suggestion: any, index: number) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-4"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(suggestion);
                }}
              >
                <img src={suggestion.avatar} alt={suggestion?.artist_name} className="rounded-full aspect-square w-6" />{" "}
                <span>{suggestion.artist_name}</span>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};
