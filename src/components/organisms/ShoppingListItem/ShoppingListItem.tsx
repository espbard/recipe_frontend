import React from "react";
import "./ShoppingListItem.scss";
import ServerIface from "../../../ServerIface";
import { useAppDispatch } from "../../../redux/hooks";
import { setPopup } from "../../../redux/globalSlice";
import { PopUpFunctions } from "../../../common/common";

interface ListItemProps {
  id: number;
  text: string;
}

const ShoppingListItem: React.FC<ListItemProps> = ({ id, text }) => {
  const iface = new ServerIface();
  const dispatch = useAppDispatch();

  const removeItem = () => {
    iface.delete("shopping_list/" + id).then((res: any) => {
      if (res.id <= 0) {
        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Failed to remove item from list",
            onClickLeft: PopUpFunctions.RELOAD,
          })
        );
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <div key={id} className="ShoppingListItem">
      <p className="ShoppingListItemText">{text}</p>
      <p className="ShoppingListItemRemove" onClick={removeItem}>
        X
      </p>
    </div>
  );
};

export default ShoppingListItem;
