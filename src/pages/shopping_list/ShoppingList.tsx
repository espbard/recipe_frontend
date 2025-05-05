import React, { useEffect, useState } from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import "./ShoppingList.scss";
import ServerIface from "../../ServerIface";
import { useAppDispatch } from "../../redux/hooks";
import { setGlobalLoading, setPopup } from "../../redux/globalSlice";
import { PopUpFunctions } from "../../common/common";
import ShoppingListItem from "../../components/organisms/ShoppingListItem/ShoppingListItem";
import HouseIcon from "../../assets/images/house-svg.svg";
import { useNavigate } from "react-router-dom";

interface ListItem {
  id: number;
  text: string;
}

const ShoppingList: React.FC = () => {
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const getListItems = () => {
      let newListItems: ListItem[] = [];
      const iface = new ServerIface();
      iface.get("shopping_list").then((res) => {
        if (res === undefined || res.length === 0) {
          return;
        } else {
          for (let i = 0; i < res.length; i++) {
            if (res[i].id !== undefined && res[i].text !== undefined) {
              newListItems.push({
                id: res[i].id,
                text: res[i].text,
              });
            }
          }
          setListItems(newListItems);
        }
      });
    };
    getListItems();
    dispatch(setGlobalLoading(false));
  }, []);

  const submitNewItem = () => {
    if (inputValue.length === 0) {
      return;
    }
    const iface = new ServerIface();
    iface.post("shopping_list", { text: inputValue }).then((res) => {
      if (res.id <= 0) {
        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Failed to add item to list",
            onClickLeft: PopUpFunctions.RELOAD,
          })
        );
      } else {
        window.location.reload();
      }
    });
  };

  const clearShoppingList = () => {
    dispatch(
      setPopup({
        open: true,
        isError: true,
        title: "Confirm",
        message:
          "This will delete all items in your shopping list. Are you sure you want to continue?",
        leftButtonText: "Yes",
        rightButtonText: "Cancel",
        onClickLeft: PopUpFunctions.CLEAR_SHOPPING_LIST,
      })
    );
  };

  return (
    <PageTemplate
      content={
        <div key="ShoppingList" id="ShoppingList">
          <h2 id="ShoppingListTitle">Shopping List</h2>
          <div id="ShoppingListContainer">
            {listItems.map((item) => (
              <ShoppingListItem id={item.id} text={item.text} key={item.id} />
            ))}
            <div className="ShoppingListItemInputContainer">
              <input
                className="ShoppingListItemInput"
                type="text"
                placeholder="Add an item"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitNewItem();
                  }
                }}
              />
              <button
                onClick={submitNewItem}
                className="ShoppingListButton ShoppingListSubmitButton"
              >
                Add
              </button>
            </div>{" "}
            <button
              onClick={clearShoppingList}
              className="ShoppingListButton ShoppingListClearButton"
            >
              Clear Shopping List
            </button>
          </div>
          <div className="HomeButtonContainer">
            <img
              src={HouseIcon}
              alt="HouseIcon"
              className="HouseIcon"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      }
    />
  );
};

export default ShoppingList;
