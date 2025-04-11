import { Component } from "react";
import { Colors } from "../../../common/common";
import CustomButtonLabel from "../CustomButtonLabel/CustomButtonLabel";
import "./CustomButton.scss";
import classNames from "classnames";

interface CustomButtonProps {
  label: string;
  hoverLabel?: string;
  color?: string;
  background?: string;
  inverted?: boolean;
  round?: boolean;
  size?: string;
  fontWeight?: number;
  filter?: boolean;
  onClick: () => void;
}

export class CustomButton extends Component<CustomButtonProps> {
  render() {
    const matchColor = (colorName: string) => {
      for (let i = 0; i < Colors.length; i++) {
        if (Colors[i].name === colorName) {
          return Colors[i].css;
        }
      }
      return "white";
    };

    let backgroundColor =
      this.props.background !== undefined
        ? matchColor(this.props.background)
        : Colors[3].css;

    let color =
      this.props.color !== undefined
        ? matchColor(this.props.color)
        : Colors[0].css;

    if (this.props.inverted) {
      color = backgroundColor;
      backgroundColor = "transparent";
    }

    const classes = classNames("CustomButton", {
      InvertedButton: this.props.inverted,
      RoundButton: this.props.round,
    });

    const getFontSize = () => {
      switch (this.props.size) {
        case "xsmall":
          return "1rem";
        case "small":
          return "1.4rem";
        case "medium":
          return "1.8rem";
        case "large":
          return "2rem";
        default:
          return "1.8rem";
      }
    };

    const textClasses = classNames("CustomButtonText", {
      CustomButtonTextFiltered: this.props.filter,
    });

    return (
      <div
        onClick={this.props.onClick}
        className={classes}
        style={{ backgroundColor, borderColor: color }}
      >
        {this.props.hoverLabel ? (
          <CustomButtonLabel
            label={this.props.label}
            hoverLabel={this.props.hoverLabel}
            fontSize={getFontSize()}
            color={color}
          />
        ) : (
          <p
            className={textClasses}
            style={{
              fontSize: getFontSize(),
              color,
              fontWeight: this.props.fontWeight ? this.props.fontWeight : 500,
            }}
          >
            {this.props.label}
          </p>
        )}
      </div>
    );
  }
}
