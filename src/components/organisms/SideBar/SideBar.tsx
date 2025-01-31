import React, { useEffect, useState, useRef } from "react";
import { TinyImage } from "../../atoms/TinyImage/TinyImage";
import logo from "../../../assets/images/recipe_icon256.png";
import classNames from "classnames";
import "./SideBar.scss";
import {
  setSearchStr,
  setSelectedIngredients,
  setSelectedTags,
  setSideBarCollapsed,
} from "../../../redux/globalSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import ServerIface from "../../../ServerIface";
import { Icon, ListItem } from "../../../common/common";
import Cookies from "js-cookie";
import SearchItem from "../../molecules/SearchItem/SearchItem";
import { CustomButton } from "../../atoms/CustomButton/CustomButton";

function useOutsideClickHandler(ref: any, callBack: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        let targetId = event.target.id;
        if (targetId.includes("-option-") || targetId.includes("-listbox")) {
          return;
        }
        callBack();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callBack]);
}

const SideBar: React.FC = () => {
  let [ingredientsList, setIngredientsList] = useState<ListItem[]>([]);
  let [tagsList, setTagsList] = useState<ListItem[]>([]);
  const [currentSearchStr, setCurrentSearchStr] = useState("");
  const search_str = useAppSelector((state) => state.global.search_str);
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.global.sidebarCollapsed);
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenCookie = Cookies.get("token");

    setToken(tokenCookie || "");
  }, [token]);

  const onSideBarButtonClick = () => {
    if (token.length > 0) {
      dispatch(setSideBarCollapsed(!collapsed));
    }
  };

  const isMainPagePath = () => {
    return window.location.pathname === "/";
  };

  const closeSideBar = () => {
    dispatch(setSideBarCollapsed(true));
  };

  const selectIngredient = (value: string) => {
    let selectedIngredientsCpy: ListItem[] = [];

    let exists = false;
    let index = 0;
    selectedIngredients.forEach((o) => {
      selectedIngredientsCpy.push({
        name: o.name,
        id: index++,
      });
      if (o.name === value) {
        exists = true;
      }
    });

    if (!exists) {
      selectedIngredientsCpy.push({
        name: value,
        id: index++,
      });
    }

    dispatch(setSelectedIngredients(selectedIngredientsCpy));
  };

  const unSelectIngredient = (value: string) => {
    let selectedIngredientsCpy: ListItem[] = [];

    let index = 0;
    selectedIngredients.forEach((o) => {
      if (o.name !== value) {
        selectedIngredientsCpy.push({
          name: o.name,
          id: index++,
        });
      }
    });

    dispatch(setSelectedIngredients(selectedIngredientsCpy));
  };

  const selectTag = (value: string) => {
    let selectedTagsCpy: ListItem[] = [];

    let exists = false;
    let index = 0;
    selectedTags.forEach((o) => {
      selectedTagsCpy.push({
        name: o.name,
        id: index++,
      });
      if (o.name === value) {
        exists = true;
      }
    });

    if (!exists) {
      selectedTagsCpy.push({
        name: value,
        id: index++,
      });
    }

    dispatch(setSelectedTags(selectedTagsCpy));
  };

  const unSelectTag = (value: string) => {
    let selectedTagsCpy: ListItem[] = [];

    let index = 0;
    selectedTags.forEach((o) => {
      if (o.name !== value) {
        selectedTagsCpy.push({
          name: o.name,
          id: index++,
        });
      }
    });

    dispatch(setSelectedTags(selectedTagsCpy));
  };

  const clearFilters = () => {
    dispatch(setSelectedIngredients([]));
    dispatch(setSelectedTags([]));
    setCurrentSearchStr("");
    dispatch(setSearchStr(""));
  };

  var sidebar_classes = classNames([
    "Sidebar",
    {
      SidebarCollapsed: collapsed || !(token.length > 0),
    },
  ]);

  var button_classes = classNames([
    "SidebarButton",
    {
      SidebarButtonDisabled: !(token.length > 0) || !isMainPagePath(),
    },
  ]);

  useEffect(() => {
    const getIngredients = async () => {
      const iface = new ServerIface();
      const data = await iface.get("ingredients");
      var ingredients: ListItem[] = [];
      if (data === undefined) {
        return;
      } else {
        for (var i = 0; i < data.length; i++) {
          ingredients.push({
            id: i,
            name: data[i].name,
          });
        }
        setIngredientsList(ingredients);
      }
    };

    const getTags = async () => {
      const iface = new ServerIface();
      const data = await iface.get("tags");
      var tags: ListItem[] = [];
      if (data === undefined) {
        return;
      } else {
        for (var i = 0; i < data.length; i++) {
          tags.push({
            id: i,
            name: data[i].name,
          });
        }
        setTagsList(tags);
      }
    };

    if (token.length > 0) {
      getIngredients();
      getTags();
    }
  }, [collapsed, token]);

  const clearSelectedIngredients = () => {
    dispatch(setSelectedIngredients([]));
  };

  const clearSelectedTags = () => {
    dispatch(setSelectedTags([]));
  };

  const wrapperRef = useRef(null);
  useOutsideClickHandler(wrapperRef, closeSideBar);

  return (
    <div className={sidebar_classes} ref={wrapperRef}>
      <div id="SidebarLogo">
        <TinyImage url={logo} alt="Logo" onClickUrl="/" />
      </div>
      <div id="SidebarContent">
        {collapsed ? (
          <div id="SidebarCollapsedClearFiltersContainer">
            {(selectedIngredients.length > 0 ||
              selectedTags.length > 0 ||
              search_str.length > 0) && (
              <div>
                <p id="SidebarCollapsedClearFiltersTitle">Filters active:</p>
                <div id="SidebarCollapsedClearFilters">
                  <CustomButton
                    label={Icon.Close}
                    onClick={() => {
                      clearFilters();
                    }}
                    size="medium"
                    background="red"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div id="SidebarFiltersList">
            <div id="SidebarSearch">
              <input
                className="SidebarSearchInput"
                type="text"
                placeholder="Recipe..."
                disabled={false}
                value={currentSearchStr}
                onChange={(e) => {
                  setCurrentSearchStr(e.target.value);
                  dispatch(setSearchStr(e.target.value));
                }}
              />

              <div className="SidebarSearchIcon">
                <p>{Icon.Search}</p>
              </div>
            </div>
            <h2 id="SidebarFiltersListTitle">Filters:</h2>
            <SearchItem
              label="ingredient"
              list={ingredientsList}
              selectOption={selectIngredient}
              unSelectOption={unSelectIngredient}
              selectedItems={selectedIngredients}
              clearSelection={clearSelectedIngredients}
            />
            <SearchItem
              label="tag"
              list={tagsList}
              selectOption={selectTag}
              unSelectOption={unSelectTag}
              selectedItems={selectedTags}
              clearSelection={clearSelectedTags}
            />
            {(selectedIngredients.length > 0 ||
              selectedTags.length > 0 ||
              search_str.length > 0) && (
              <div id="SidebarClearFilters">
                <CustomButton
                  label="Clear filters"
                  onClick={() => clearFilters()}
                  size="small"
                  color="white"
                  background="red"
                />
              </div>
            )}
          </div>
        )}
      </div>
      {isMainPagePath() ? (
        <div className={button_classes} onClick={() => onSideBarButtonClick()}>
          <p>{collapsed ? Icon.BurgerMenu : Icon.Close}</p>
        </div>
      ) : (
        <div className={button_classes}>
          <p>{Icon.BurgerMenu}</p>
        </div>
      )}
    </div>
  );
};

export default SideBar;
