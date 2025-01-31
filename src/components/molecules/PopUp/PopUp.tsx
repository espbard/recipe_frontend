import { Component } from "react";
import classNames from "classnames";
import "./PopUp.scss";

interface PopUpProps {
  title: string;
  text: string;
  leftButtonText: string;
  rightButtonText?: string;
  color?: string;
  singleButton?: boolean;
  onClickLeft: () => void;
  onClickRight?: () => void;
}

export class PopUp extends Component<PopUpProps> {
  render() {
    let popUpClasses = classNames("PopUp", {
      RedPopUp: this.props.color === "red",
      GreenPopUp: this.props.color === "green",
    });
    return (
      <div className="PopUpOverlay">
        <div className={popUpClasses}>
          <div className="PopUpTitle">
            <h4>{this.props.title}</h4>
          </div>
          <div className="PopUpText">
            <p>{this.props.text}</p>
          </div>
          <div className="PopUpButtons">
            <button onClick={this.props.onClickLeft}>
              {this.props.leftButtonText}
            </button>
            {!this.props.singleButton && (
              <button onClick={this.props.onClickRight}>
                {this.props.rightButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
