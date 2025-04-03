import { useState, useEffect } from "react";
import FilterSvg from "../../../assets/images/filter.svg";
import "./FiltersBar.scss";
import SearchItem from "../../molecules/SearchItem/SearchItem";
import { Icon, ListItem } from "../../../common/common";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  setSelectedIngredients,
  setSelectedTags,
} from "../../../redux/globalSlice";
import ServerIface from "../../../ServerIface";

const FiltersBar: React.FC = ({}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [ingredientsList, setIngredientsList] = useState<ListItem[]>([]);
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const [tagsList, setTagsList] = useState<ListItem[]>([]);
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const dispatch = useAppDispatch();

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

  const clearSelectedIngredients = () => {
    dispatch(setSelectedIngredients([]));
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

  const clearSelectedTags = () => {
    dispatch(setSelectedTags([]));
  };

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

    getIngredients();
    getTags();
  }, []);

  return (
    <div id="FiltersBar">
      <div className="FilterIconContainer">
        <div className="FilterIcon">
          <img
            src={FilterSvg}
            onClick={() => setCollapsed(!collapsed)}
            tabIndex={0}
          />
        </div>
        {(selectedIngredients.length > 0 || selectedTags.length > 0) && (
          <div className="FilterDotContainer">
            <p className="FilterDot">{Icon.Dot}</p>
          </div>
        )}
      </div>
      {!collapsed && (
        <div className="HidableFilters">
          <div>
            <SearchItem
              label="Ingredient"
              list={ingredientsList}
              selectOption={selectIngredient}
              unSelectOption={unSelectIngredient}
              selectedItems={selectedIngredients}
              clearSelection={clearSelectedIngredients}
            />
            <SearchItem
              label="Tag"
              list={tagsList}
              selectOption={selectTag}
              unSelectOption={unSelectTag}
              selectedItems={selectedTags}
              clearSelection={clearSelectedTags}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersBar;
