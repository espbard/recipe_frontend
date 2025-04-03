import React from "react";
import ListSearch from "../ListSearch/ListSearch";
import { Capitalize, ListItem } from "../../../common/common";
import "./SearchItem.scss";

interface SearchItemProps {
  label: string | undefined;
  list: ListItem[];
  selectedItems: ListItem[];
  selectOption: (value: string) => void;
  unSelectOption: (value: string) => void;
  clearSelection: () => void;
}

const SearchItem: React.FC<SearchItemProps> = ({
  label,
  list,
  selectedItems,
  selectOption,
  unSelectOption,
  clearSelection,
}) => {
  return (
    <div className="SearchItem">
      <div className="SearchItemRow">
        <h6 className="SearchItemTitle">{Capitalize(label) + "s:"}</h6>
        {selectedItems.length > 0 && <p className="SearchItemDot">*</p>}
      </div>
      <div className="SearchItemInput">
        <ListSearch
          label={"Select " + label}
          list={list}
          selectedOptions={selectedItems}
          selectOption={selectOption}
          unSelectOption={unSelectOption}
          onClear={() => clearSelection()}
        />
      </div>
    </div>
  );
};

export default SearchItem;
