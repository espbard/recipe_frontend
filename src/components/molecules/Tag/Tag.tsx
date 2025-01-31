import { Component } from "react";
import classNames from "classnames";
import "./Tag.scss";
import { AutocompleteInput } from "../../atoms/AutocompleteInput/AutocompleteInput";
import { AutocompleteOption, Capitalize } from "../../../common/common";

interface TagStates {
  editing: boolean;
  active_option: AutocompleteOption;
  tag_list: AutocompleteOption[];
}

interface TagProps {
  text: string;
  id?: number;
  noSymbol?: boolean;
  editable?: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
  onSave?: (id: number, text: string) => void;
  allTags?: AutocompleteOption[];
}

export class Tag extends Component<TagProps, TagStates> {
  constructor(props: TagProps) {
    super(props);
    this.state = {
      editing: this.props.text === "",
      active_option: { id: -1, label: "" },
      tag_list: props.allTags || [],
    };
  }

  componentDidMount(): void {
    var options_cpy = this.state.tag_list;

    this.setState({ tag_list: options_cpy });

    if (this.props.text.length < 1 || !this.props.editable) {
      return;
    }
    var tag_exists = false;
    var highest_id = -1;
    for (var i = 0; i < this.state.tag_list.length; i++) {
      if (this.props.allTags![i] === undefined) {
        continue;
      }
      if (this.props.allTags![i].id > highest_id) {
        highest_id = this.props.allTags![i].id;
      }
      if (this.state.tag_list[i].label === this.props.text) {
        tag_exists = true;
        this.setState({ active_option: this.state.tag_list[i] });
        break;
      }
    }

    if (!tag_exists) {
      var new_option = {
        id: highest_id + 1,
        label: this.props.text,
      };

      this.setState({ tag_list: [...this.state.tag_list, new_option] });
    }
  }

  render() {
    const save = () => {
      this.setState({ editing: false });
      this.props.onSave &&
        this.props.onSave(
          this.props.id || 0,
          this.state.active_option?.label || ""
        );
    };

    const editRowClasses = classNames("EditRow", {
      EditRowActive: this.state.editing,
    });

    const TagClasses = classNames("Tag", {
      ClickableTag: this.props.onAdd,
      ExpandedTag: this.state.editing,
    });

    const setInputValue = (value: string, id: number) => {
      this.setState({ active_option: { id, label: value } });
    };

    const { text } = this.props;
    return (
      <div className="TagWrapper">
        <div className="TagContainer">
          {this.props.editable && (
            <div className={editRowClasses}>
              <div
                className="EditRowIcon"
                onClick={() => this.setState({ editing: true })}
              >
                ✏️
              </div>
              <div className="EditRowIcon" onClick={this.props.onDelete}>
                ❌
              </div>
            </div>
          )}
          {this.props.onAdd ? (
            <div onClick={this.props.onAdd} className={TagClasses}>
              <p>{Capitalize(text)}</p>
            </div>
          ) : (
            <div className={TagClasses}>
              {!this.props.noSymbol && <p>•</p>}
              {this.state.editing ? (
                <div className="TagInputRow">
                  <AutocompleteInput
                    options={this.state.tag_list}
                    activeOption={this.state.active_option}
                    label="Tag"
                    setValue={setInputValue}
                  />
                  <div className="EditRowIcon" onClick={save}>
                    ✅
                  </div>
                  <div className="EditRowIcon" onClick={this.props.onDelete}>
                    ❌
                  </div>
                </div>
              ) : (
                <p>{Capitalize(this.state.active_option?.label || text)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
