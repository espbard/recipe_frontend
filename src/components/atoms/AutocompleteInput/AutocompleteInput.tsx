import { Component } from "react";
import "./AutocompleteInput.scss";
import { Autocomplete, TextField } from "@mui/material";
import { AutocompleteOption } from "../../../common/common";

interface AutocompleteInputProps {
  options: AutocompleteOption[];
  activeOption: AutocompleteOption;
  setValue: (value: string, id: number) => void;
  label?: string;
}

interface AutocompleteInputStates {
  activeOption: AutocompleteOption;
  options: AutocompleteOption[];
}

export class AutocompleteInput extends Component<
  AutocompleteInputProps,
  AutocompleteInputStates
> {
  constructor(props: AutocompleteInputProps) {
    super(props);
    this.state = {
      activeOption: this.props.activeOption,
      options: this.props.options,
    };
  }
  render() {
    const updateActiveOption = (value: string) => {
      this.setState({ options: this.props.options });

      let highest_id = -1;
      for (let i = 0; i < this.state.options.length; i++) {
        if (this.state.options[i].id > highest_id) {
          highest_id = this.state.options[i].id;
        }
        if (this.state.options[i].label === value) {
          this.setState({ activeOption: this.state.options[i] });
          this.props.setValue(
            this.state.options[i].label,
            this.state.options[i].id
          );
          return;
        }
      }
      let new_option = { id: highest_id + 1, label: value };
      this.setState({ options: [...this.state.options, new_option] });
      this.setState({ activeOption: new_option });
      this.props.setValue(new_option.label, new_option.id);
    };

    return (
      <div>
        <Autocomplete
          options={this.state.options}
          value={this.state.activeOption}
          sx={{ width: "250px" }}
          onChange={(_e, value) => {
            updateActiveOption(value?.label || "");
          }}
          renderInput={(params) => (
            <TextField
              className="AutocompleteInputField"
              {...params}
              label={this.props.label}
              onChange={(e) => {
                updateActiveOption(e.target.value);
              }}
            />
          )}
        />
      </div>
    );
  }
}
