import { Component } from "react";
import { CustomButton } from "../../atoms/CustomButton/CustomButton";
import "./InstructionInput.scss";

interface InstructionProps {
  text: string;
  id: number;
  onChange: (index: number, text: string) => void;
  remove: (index: number) => void;
  move: (index: number, direction_up: boolean) => void;
  onEnter?: () => void;
}

export class InstructionInput extends Component<InstructionProps> {
  render() {
    return (
      <div className="NewRecipeInstruction">
        <p className="NewRecipeInstructionNumber">{this.props.id + 1}.</p>
        <input
          className="NewRecipeInstructionText"
          type="text"
          placeholder="Instruction..."
          value={this.props.text}
          onChange={(e) => {
            this.props.onChange(this.props.id, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              this.props.onEnter && this.props.onEnter();
            }
          }}
        />

        <div className="NewRecipeInstructionButtonsRow">
          <CustomButton
            label="⮝"
            onClick={() => this.props.move(this.props.id, true)}
            size="small"
            inverted
          />
          <CustomButton
            label="⮟"
            onClick={() => this.props.move(this.props.id, false)}
            size="small"
            inverted
          />
          <CustomButton
            label="-"
            onClick={() => this.props.remove(this.props.id)}
            size="small"
            inverted
          />
        </div>
      </div>
    );
  }
}
