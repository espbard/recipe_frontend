import React, { useState } from "react";
import ListSearch from "../ListSearch/ListSearch";
import { Capitalize, ListItem } from "../../../common/common";
import "./SearchItem.scss";
import { Icon } from "../../../common/common";

interface SearchItemProps {
  label: string;
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
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="SearchItem">
      <div className="SearchItemRow" onClick={() => setCollapsed(!collapsed)}>
        <h6 className="SearchItemTitle">{Capitalize(label) + "s"}</h6>
        {selectedItems.length > 0 && <p className="SearchItemDot">*</p>}
        <div className="SearchItemCollapse">
          {collapsed ? Icon.ChevronDown : Icon.ChevronUp}
        </div>
      </div>
      {!collapsed && (
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
      )}
    </div>
  );
};

export default SearchItem;
