import React, { useState, useEffect } from "react";
import {
  AutocompleteOption,
  Capitalize,
  ListItem,
} from "../../../common/common";
import { Autocomplete, TextField } from "@mui/material";
import { Icon } from "../../../common/common";
import "./ListSearch.scss";

interface ListSearchProps {
  label: string;
  list: ListItem[];
  selectedOptions: ListItem[];
  selectOption: (value: string) => void;
  unSelectOption: (value: string) => void;
  onClear: () => void;
}

const ListSearch: React.FC<ListSearchProps> = ({
  label,
  list,
  selectedOptions,
  selectOption,
  unSelectOption,
  onClear,
}) => {
  const [activeOption, setActiveOption] = useState<AutocompleteOption>({
    id: -1,
    label: "",
  });

  const [availableOptions, setAvailableOptions] = useState<ListItem[]>(list);

  const onOptionSelect = (value: string) => {
    setActiveOption({ label: "", id: -1 });
    selectOption(value);
  };

  const onOptionUnSelect = (value: string) => {
    setActiveOption({ label: "", id: -1 });
    unSelectOption(value);
  };

  const formatAutoCompleteList = (list: ListItem[]) => {
    let formatted_list: AutocompleteOption[] = [];

    for (let i = 0; i < list.length; i++) {
      formatted_list.push({
        id: i,
        label: list[i].name,
      });
    }
    return formatted_list;
  };

  useEffect(() => {
    let new_options: ListItem[] = [];

    let index = 0;
    list.forEach((o) => {
      let selected = false;
      selectedOptions.forEach((so) => {
        if (so.name === o.name) {
          selected = true;
        }
      });
      if (!selected) {
        new_options.push({
          name: o.name,
          id: index,
        });
        index += 1;
      }
    });

    setAvailableOptions(new_options);
  }, [selectedOptions, list]);

  return (
    <div className="ListSearchContainer">
      <div className="ListSearchInputContainer">
        <div className="ListSearchInputRow">
          <Autocomplete
            className="ListSearchInput"
            options={formatAutoCompleteList(availableOptions)}
            onChange={(_e, value, reason) => {
              if (reason === "selectOption") {
                onOptionSelect(value?.label || "");
              }
            }}
            value={activeOption}
            renderInput={(params) => (
              <TextField {...params} label={label} size="small" />
            )}
          />
          <div
            className="ListSearchInputClear"
            onClick={() => {
              onClear();
            }}
          >
            {Icon.Delete}
          </div>
        </div>
      </div>
      <div className="ListSearchOutputContainer">
        {formatAutoCompleteList(selectedOptions).map((o) => (
          <div key={o.id} className="ListSearchOutput">
            <div className="ListSearchOutputText">{Capitalize(o.label)}</div>
            <div className="ListSearchOutputButton">
              <div
                className="ListSearchInputItemClear"
                onClick={() => {
                  onOptionUnSelect(o.label);
                }}
              >
                {Icon.Close}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListSearch;
