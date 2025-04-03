import React from "react";
import classNames from "classnames";
import { useAppSelector } from "../../../redux/hooks";
import "./PopUp.scss";
import ServerIface from "../../../ServerIface";
import { PopUpFunctions } from "../../../common/common";
import { setPopup } from "../../../redux/globalSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface PopUpProps {
  title: string;
  text: string;
  leftButtonText: string;
  rightButtonText?: string;
  isError: boolean;
  singleButton?: boolean;
}

const PopUp: React.FC<PopUpProps> = ({
  title,
  text,
  leftButtonText,
  rightButtonText,
  isError,
  singleButton,
}) => {
  const iface = new ServerIface();
  let popUpClasses = classNames("PopUp", {
    RedPopUp: isError,
    GreenPopUp: !isError,
  });
  let curr_popup = useAppSelector((state) => state.global.popup);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const deleteRecipe = async () => {
    let data = await iface
      .delete("recipes/" + curr_popup.id)
      .then((res) => res);

    if (data === undefined) {
      dispatch(
        setPopup({
          open: true,
          isError: true,
          message: "Failed to delete recipe",
        })
      );
    } else {
      dispatch(
        setPopup({
          open: false,
          isError: false,
          message: "",
        })
      );
      navigate("/");
    }
  };

  const retry = () => {
    dispatch(
      setPopup({
        open: false,
        isError: false,
        message: "",
      })
    );
    window.location.reload();
  };

  const close = () => {
    dispatch(
      setPopup({
        open: false,
        isError: false,
        message: "",
      })
    );
  };

  const callPopupFunction = (function_name: string) => {
    switch (function_name) {
      case PopUpFunctions.DELETE_FUNCTION:
        deleteRecipe();
        close();
        break;
      case PopUpFunctions.GO_TO_RECIPE:
        close();
        if (curr_popup.id === undefined) break;
        navigate("/recipe/" + curr_popup.id);
        break;
      case PopUpFunctions.HOME:
        close();
        navigate("/");
        break;
      case PopUpFunctions.RELOAD:
        retry();
        break;
      case PopUpFunctions.CLOSE:
      default:
        close();
        break;
    }
  };

  return (
    <div className="PopUpOverlay">
      <div className={popUpClasses}>
        <div className="PopUpTitle">
          <h4>{title}</h4>
        </div>
        <div className="PopUpText">
          <p>{text}</p>
        </div>
        <div className="PopUpButtons">
          <button
            onClick={() =>
              callPopupFunction(
                curr_popup.onClickLeft ? curr_popup.onClickLeft : ""
              )
            }
          >
            {leftButtonText}
          </button>
          {!singleButton && (
            <button
              onClick={() =>
                callPopupFunction(
                  curr_popup.onClickRight ? curr_popup.onClickRight : ""
                )
              }
            >
              {rightButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
