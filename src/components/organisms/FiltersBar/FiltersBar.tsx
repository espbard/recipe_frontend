import { useState, useEffect } from "react";
import SearchItem from "../../molecules/SearchItem/SearchItem";
import { ListItem } from "../../../common/common";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  setSelectedIngredients,
  setSelectedAdvancedIngredients,
  setSelectedTags,
  setSelectedMealType,
  setOnlyShowExternal,
} from "../../../redux/globalSlice";
import ServerIface from "../../../ServerIface";
import Filters from "../Filters/Filters";
import IngredientFilters from "../IngredientFilters/IngredientFilters";
import "./FiltersBar.scss";
import ExternalFilter from "../ExternalFilter/ExternalFilter";
import { Checkbox } from "@mui/material";

enum FilterType {
  FILTERS = "FILTERS",
  EXTERNAL = "EXTERNAL",
  INGREDIENTS = "INGREDIENTS",
  NONE = "NONE",
}

const FiltersBar: React.FC = () => {
  const [openFilter, setOpenFilter] = useState(FilterType.NONE);

  const [ingredientsList, setIngredientsList] = useState<ListItem[]>([]);
  const [advancedIngredientsList, setAdvancedIngredientsList] = useState<
    ListItem[]
  >([]);
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const selectedAdvancedIngredients = useAppSelector(
    (state) => state.global.selectedAdvancedIngredients
  );
  const [tagsList, setTagsList] = useState<ListItem[]>([]);
  const onlyShowExternal = useAppSelector(
    (state) => state.global.onlyShowExternal
  );
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const selectedMeal = useAppSelector((state) => state.global.selectedMealType);
  const dispatch = useAppDispatch();

  const setFiltersOpen = () => setOpenFilter(FilterType.FILTERS);
  const setExternalOpen = () => setOpenFilter(FilterType.EXTERNAL);
  const setIngredientsOpen = () => setOpenFilter(FilterType.INGREDIENTS);
  const setNoneOpen = () => setOpenFilter(FilterType.NONE);

  const mealTypes: ListItem[] = [
    { name: "Breakfast", id: 0 },
    { name: "Lunch", id: 1 },
    { name: "Soup", id: 2 },
    { name: "Dinner", id: 3 },
    { name: "Dessert", id: 4 },
    { name: "Baked", id: 5 },
    { name: "Snack", id: 6 },
    { name: "Side", id: 7 },
  ];

  const selectIngredient = (value: string, id?: number) => {
    let selectedIngredientsCpy: ListItem[] = [];

    for (let i = 0; i < selectedIngredients.length; i++) {
      selectedIngredientsCpy.push({
        name: selectedIngredients[i].name,
        id: selectedIngredients[i].id,
      });
    }

    if (id !== undefined) {
      selectedIngredientsCpy.push({
        name: value,
        id: id,
      });
    }

    dispatch(setSelectedIngredients(selectedIngredientsCpy));
  };

  const selectAdvancedIngredient = (value: string, id?: number) => {
    let selectAdvancedIngredientsCpy: ListItem[] = [];

    selectedAdvancedIngredients.forEach((o) => {
      selectAdvancedIngredientsCpy.push({
        name: o.name,
        id: o.id,
      });
    });

    if (id !== undefined) {
      selectAdvancedIngredientsCpy.push({
        name: value,
        id: id,
      });
    }

    dispatch(setSelectedAdvancedIngredients(selectAdvancedIngredientsCpy));
  };

  const unSelectIngredient = (value: string) => {
    let selectedIngredientsCpy: ListItem[] = [];

    selectedIngredients.forEach((o) => {
      if (o.name !== value) {
        selectedIngredientsCpy.push({
          name: o.name,
          id: o.id,
        });
      }
    });

    dispatch(setSelectedIngredients(selectedIngredientsCpy));
  };

  const unSelectAdvancedIngredient = (value: string) => {
    let selectedAdvancedIngredientsCpy: ListItem[] = [];

    selectedAdvancedIngredients.forEach((o) => {
      if (o.name !== value) {
        selectedAdvancedIngredientsCpy.push({
          name: o.name,
          id: o.id,
        });
      }
    });

    dispatch(setSelectedAdvancedIngredients(selectedAdvancedIngredientsCpy));
  };

  const clearSelectedIngredients = () => {
    dispatch(setSelectedIngredients([]));
  };

  const clearSelectedAdvancedIngredients = () => {
    dispatch(setSelectedAdvancedIngredients([]));
  };

  const selectMealType = (value: string) => {
    dispatch(setSelectedMealType(value));
  };

  const unSelectMealType = (_value: string) => {
    dispatch(setSelectedMealType(""));
  };

  const unSelectMealTypes = () => {
    dispatch(setSelectedMealType(""));
  };

  const setSelectShowExternal = (value: boolean) => {
    dispatch(setOnlyShowExternal(value));
  };

  const listItemFromString = (value: string) => {
    if (value === "") return [];
    return [
      {
        name: value,
        id: 0,
      },
    ];
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
            id: data[i].id,
            name: data[i].name,
          });
        }
        setIngredientsList(ingredients);
        setAdvancedIngredientsList(ingredients);
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
      <div className="FiltersBarButtons">
        <Filters
          isOpen={openFilter === FilterType.FILTERS}
          open={setFiltersOpen}
          close={setNoneOpen}
          disabled={onlyShowExternal}
        />
        <ExternalFilter
          isOpen={openFilter === FilterType.EXTERNAL}
          open={setExternalOpen}
          close={setNoneOpen}
        />
        <IngredientFilters
          isOpen={openFilter === FilterType.INGREDIENTS}
          open={setIngredientsOpen}
          close={setNoneOpen}
          disabled={onlyShowExternal}
        />
      </div>
      {openFilter === FilterType.FILTERS && (
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
            <SearchItem
              label="Meal"
              list={mealTypes}
              selectOption={selectMealType}
              unSelectOption={unSelectMealType}
              selectedItems={listItemFromString(selectedMeal)}
              clearSelection={unSelectMealTypes}
            />
          </div>
        </div>
      )}

      {openFilter === FilterType.EXTERNAL && (
        <div className="HidableFilters">
          <div className="HidableFiltersRow">
            <h6>Show only external recipes:</h6>
            <Checkbox
              checked={onlyShowExternal}
              color="success"
              onChange={(e) => setSelectShowExternal(e.target.checked)}
            />
          </div>
        </div>
      )}

      {openFilter === FilterType.INGREDIENTS && (
        <div className="HidableFilters">
          <div>
            <SearchItem
              label="Ingredient"
              list={advancedIngredientsList}
              selectOption={selectAdvancedIngredient}
              unSelectOption={unSelectAdvancedIngredient}
              selectedItems={selectedAdvancedIngredients}
              clearSelection={clearSelectedAdvancedIngredients}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersBar;
