import React from "react";
import classNames from "classnames";
import { useAppSelector } from "../../../redux/hooks";
import "./PopUp.scss";
import ServerIface from "../../../ServerIface";
import { PopUpFunctions } from "../../../common/common";
import { setPopup, setRecipeList } from "../../../redux/globalSlice";
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
    if (curr_popup.external_recipe) {
      let data = await iface
        .delete("external_recipes/" + curr_popup.id)
        .then((res) => res);

      if (data === undefined) {
        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Failed to delete recipe",
            leftButtonText: "Reload page",
            onClickLeft: PopUpFunctions.RELOAD,
          })
        );
      } else {
        dispatch(
          setPopup({
            open: true,
            isError: false,
            message: "Successfully deleted recipe",
            leftButtonText: "Go to recipes",
            onClickLeft: PopUpFunctions.GO_TO_RECIPES,
            singleButton: true,
          })
        );
      }
    } else {
      let data = await iface
        .delete("recipes/" + curr_popup.id)
        .then((res) => res);

      if (data === undefined) {
        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Failed to delete recipe",
            leftButtonText: "Reload page",
            onClickLeft: PopUpFunctions.RELOAD,
          })
        );
      } else {
        dispatch(
          setPopup({
            open: true,
            isError: false,
            message: "Successfully deleted recipe",
            leftButtonText: "Go to recipes",
            onClickLeft: PopUpFunctions.GO_TO_RECIPES,
            singleButton: true,
          })
        );
      }
    }
  };

  const clearShoppingList = async () => {
    let item_ids: number[] = [];
    await iface.get("shopping_list").then((res) => {
      if (res === undefined || res.length === 0) {
        return;
      } else {
        for (let i = 0; i < res.length; i++) {
          if (res[i].id !== undefined) {
            item_ids.push(res[i].id);
          }
        }
      }
    });

    item_ids.forEach((id) => {
      iface.delete("shopping_list/" + id).then((res) => {
        if (res === undefined || res !== 200) {
          dispatch(
            setPopup({
              open: true,
              isError: true,
              message: "Failed to clear shopping list",
              onClickLeft: PopUpFunctions.RELOAD,
            })
          );
          return;
        }
      });
    });
    dispatch(
      setPopup({
        open: true,
        isError: false,
        message: "Shopping list cleared",
        onClickLeft: PopUpFunctions.RELOAD,
      })
    );
  };

  const reload = () => {
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
        dispatch(setRecipeList([]));
        close();
        break;
      case PopUpFunctions.GO_TO_RECIPES:
        navigate("/recipes", { replace: true });
        close();
        break;
      case PopUpFunctions.GO_BACK:
        if (navigate(-1) === undefined) {
          navigate("/");
          close();
          break;
        }
        close();
        break;
      case PopUpFunctions.GO_TO_RECIPE:
        if (curr_popup.id === undefined) {
          close();
          break;
        }
        if (curr_popup.external_recipe) {
          navigate("/recipe/e" + curr_popup.id);
        } else {
          navigate("/recipe/" + curr_popup.id);
        }
        close();
        break;
      case PopUpFunctions.GO_TO_NEW_RECIPE:
        if (curr_popup.id === undefined) {
          close();
          break;
        }
        navigate("/recipe/" + curr_popup.id, { replace: true });
        dispatch(setRecipeList([]));
        close();
        break;
      case PopUpFunctions.GO_TO_NEW_EXTERNAL_RECIPE:
        navigate(-1);
        if (curr_popup.id === undefined) {
          close();
          break;
        }
        navigate("/recipe/e" + curr_popup.id);
        dispatch(setRecipeList([]));
        close();
        break;
      case PopUpFunctions.CLEAR_SHOPPING_LIST:
        clearShoppingList();
        break;
      case PopUpFunctions.HOME:
        close();
        navigate("/");
        break;
      case PopUpFunctions.RELOAD:
        reload();
        break;
      case PopUpFunctions.CLOSE_AND_REFRESH_RECIPES:
        dispatch(setRecipeList([]));
        close();
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
