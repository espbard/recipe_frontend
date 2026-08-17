import React, { useRef, useEffect, useState } from "react";
import "./SelectRecipeBox.scss";
import ServerIface from "../../../ServerIface";
import missing_picture_placeholder from "../../../assets/images/missing_picture_placeholder.png";
import RecipeImage from "../../atoms/RecipeImage/RecipeImage";
import classNames from "classnames";
import CloseIcon from "../../../assets/images/close-svgrepo-com.svg";

function useOutsideClickHandler(ref: any, callBack: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callBack();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callBack]);
}

interface SelectRecipeBoxProps {
  selectRecipe: (id: number) => void;
  setInvisible: () => void;
}

interface RecipeItem {
  id: number;
  title: string;
  image: string;
}

const SelectRecipeBox: React.FC<SelectRecipeBoxProps> = ({
  selectRecipe,
  setInvisible,
}) => {
  const [recipeList, setRecipeList] = useState<RecipeItem[]>([]);
  const [searchStr, setSearchStr] = useState<string>("");
  const wrapperRef = useRef(null);
  const iface = new ServerIface();

  useOutsideClickHandler(wrapperRef, () => setInvisible());

  const getRecipes = () => {
    iface.get("recipes").then((res) => {
      if (res !== undefined) {
        setRecipeList([]);

        let recipes_res = res;

        iface.get("external_recipes").then((ext_res) => {
          if (ext_res !== undefined) {
            recipes_res = recipes_res.concat(ext_res);
          }

          let newRecipeList: RecipeItem[] = [];

          for (let i = 0; i < recipes_res.length; i++) {
            let newRecipe: RecipeItem = {
              id: -1,
              title: "",
              image: missing_picture_placeholder,
            };
            if (
              recipes_res[i].id !== undefined &&
              recipes_res[i].title !== undefined
            ) {
              newRecipe.id = recipes_res[i].id;
              newRecipe.title = recipes_res[i].title;
            } else {
              continue;
            }
            if (
              recipes_res[i].image !== undefined &&
              recipes_res[i].image.length > 0
            ) {
              let cdn_url = iface.getCdn();
              newRecipe.image = cdn_url + recipes_res[i].image;
            }
            if (
              searchStr.length === 0 ||
              newRecipe.title.toLowerCase().includes(searchStr.toLowerCase())
            ) {
              newRecipeList.push(newRecipe);
            }
          }

          setRecipeList(newRecipeList);
        });
      }
    });
  };

  useEffect(() => {
    getRecipes();
  }, [searchStr]);

  const onRecipeClick = (id: number) => {
    selectRecipe(id);
    setInvisible();
  };

  const onCloseClick = () => {
    setInvisible();
  };

  const recipeListClasses = classNames("SelectRecipeList", {
    EmptyList: recipeList.length === 0,
  });

  return (
    <div className="SelectRecipeBoxOverlay">
      <div className="SelectRecipeBoxContainer" ref={wrapperRef}>
        <div className="CloseIcon">
          <img
            className="CloseIconText"
            onClick={onCloseClick}
            src={CloseIcon}
            alt="Close"
          />
        </div>
        <h1 className="SelectRecipeBoxTitle">Select Recipe</h1>
        <input
          className="SelectRecipeBoxInput"
          type="text"
          value={searchStr}
          onChange={(e) => {
            setSearchStr(e.target.value);
          }}
        />
        <div className={recipeListClasses}>
          {recipeList.map((e) => {
            return (
              <div
                className="SelectRecipeListItem"
                key={e.id}
                onClick={() => onRecipeClick(e.id)}
              >
                <RecipeImage
                  image={e.image}
                  alt={e.title}
                  className="SelectRecipeListItemImage"
                />
                <p className="SelectRecipeListItemTitle">{e.title}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectRecipeBox;
