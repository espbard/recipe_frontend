import React, { useEffect, useState, useRef } from "react";
import { ListItem } from "../../../common/common";
import "./SearchDropdown.scss";
import SearchDropdownItem from "../../atoms/SearchDropdownItem/SearchDropdownItem";

interface SearchDropdownProps {
  list: ListItem[];
  search_str: string;
}

function useOutsideClickHandler(ref: any, callBack: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callBack();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callBack]);
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  list,
  search_str,
}) => {
  const [filteredList, setFilteredList] = useState<ListItem[]>([]);
  const [dropdownHidden, setDropdownHidden] = useState(false);
  const wrapperRef = useRef(null);

  useOutsideClickHandler(wrapperRef, () => setDropdownHidden(true));

  useEffect(() => {
    setDropdownHidden(false);
    let temp_list: ListItem[] = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.toLowerCase().includes(search_str.toLowerCase())) {
        temp_list.push(list[i]);
      }
    }
    setFilteredList(temp_list);
  }, [search_str, list]);

  if (filteredList.length === 0 || dropdownHidden) {
    return <></>;
  } else {
    return (
      <div className="SearchDropdown" ref={wrapperRef}>
        {filteredList.map((item) => {
          return <SearchDropdownItem key={item.id} id={item.id} />;
        })}
      </div>
    );
  }
};

export default SearchDropdown;
