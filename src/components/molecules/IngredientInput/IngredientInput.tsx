import { Component } from "react";
import { CustomButton } from "../../atoms/CustomButton/CustomButton";
import "./IngredientInput.scss";

interface IngredientProps {
  name: string;
  quantity: number;
  unit: string;
  id: number;
  onChangeQuantity: (index: number, quantity: number) => void;
  onChangeUnit: (index: number, unit: string) => void;
  onChangeName: (index: number, name: string) => void;
  remove: (index: number) => void;
  onEnter?: () => void;
}

export class IngredientInput extends Component<IngredientProps> {
  render() {
    return (
      <div className="NewRecipeIngredient">
        <input
          className="NewRecipeIngredientQuantity"
          type="number"
          placeholder="Quantity"
          value={this.props.quantity}
          onChange={(e) => {
            this.props.onChangeQuantity(
              this.props.id,
              parseInt(e.target.value)
            );
          }}
        />
        <input
          className="NewRecipeIngredientUnit"
          type="text"
          placeholder="Unit"
          value={this.props.unit}
          onChange={(e) => {
            this.props.onChangeUnit(this.props.id, e.target.value);
          }}
        />
        <input
          className="NewRecipeIngredientName"
          type="text"
          placeholder="Ingredient"
          value={this.props.name}
          onChange={(e) => {
            this.props.onChangeName(this.props.id, e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              this.props.onEnter && this.props.onEnter();
            }
          }}
        />
        <div className="NewRecipeIngredientButtons">
          <CustomButton
            label="-"
            onClick={() => this.props.remove(this.props.id)}
            inverted
          />
        </div>
      </div>
    );
  }
}
