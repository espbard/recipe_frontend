import React, { useEffect, useState } from "react";
import ServerIface from "../../../ServerIface";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import "./RecipeList.scss";
import FiltersBar from "../FiltersBar/FiltersBar";
import { useDispatch } from "react-redux";
import {
  setGlobalLoading,
  setSelectedMealType,
  setSelectedTags,
  setSelectedIngredients,
  setSelectedAdvancedIngredients,
  setRecipeList,
} from "../../../redux/globalSlice";
import FilteredRecipeList from "../../molecules/FilteredRecipeList/FilteredRecipeList";
import Cookies from "js-cookie";
import PlusIcon from "../../../assets/images/plus-svgrepo-com.svg";
import HouseIcon from "../../../assets/images/house-svg.svg";
import { RecipeIface, ListItem } from "../../../common/common";

const RecipeList: React.FC = () => {
  const [allTags, setTags] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeIface[]>([]);
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const onlyShowExternal = useAppSelector(
    (state) => state.global.onlyShowExternal
  );
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const selectedMealType = useAppSelector(
    (state) => state.global.selectedMealType
  );
  const search_str = useAppSelector((state) => state.global.search_str);
  const globalRecipes = useAppSelector((state) => state.global.recipeList);
  const dispatch = useDispatch();
  const user_token = Cookies.get("token");

  const sortRecipes = (a: RecipeIface, b: RecipeIface) => {
    if (a.is_external && !b.is_external) {
      return 1;
    }
    if (!a.is_external && b.is_external) {
      return -1;
    }

    let time_a = a.updated_at;
    let time_b = b.updated_at;

    const dateA = time_a ? new Date(time_a).getTime() : 0; // Default to 0 if undefined or null
    const dateB = time_b ? new Date(time_b).getTime() : 0; // Default to 0 if undefined or null

    return dateB - dateA; // Sort in descending order (most recent first)
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const iface = new ServerIface();

      const data = iface.get("recipes");

      let temp_recipes: RecipeIface[] = [];

      if (data === undefined) {
        return;
      }

      let res = await data.then((res: any) => {
        if (res === undefined) {
          return [];
        }

        iface.get("external_recipes").then((ext_res: any) => {
          if (ext_res !== undefined) {
            for (let i = 0; i < ext_res.length; i++) {
              let temp_recipe: RecipeIface = {
                ...ext_res[i],
                is_external: true,
              };
              temp_recipes.push(temp_recipe);
            }
          }
        });
        return res;
      });
      for (let i = 0; i < res.length; i++) {
        var ingredientsList: number[] = [];

        iface
          .get_search("recipe_ingredients", res[i].id)
          .then((r_i_res: any) => {
            if (r_i_res !== undefined) {
              for (let j = 0; j < r_i_res.length; j++) {
                if (r_i_res[j].ingredient_id !== undefined) {
                  ingredientsList = [
                    ...ingredientsList,
                    r_i_res[j].ingredient_id,
                  ];
                }
              }
            }
          });

        var tagsList: number[] = [];
        const recipe_tags = iface.get_search("recipe_tags", res[i].id);
        let recipe_t_res = await recipe_tags.then((res: any) => res);
        for (let j = 0; j < recipe_t_res.length; j++) {
          if (recipe_t_res[j].tag_id !== undefined) {
            tagsList = [...tagsList, recipe_t_res[j].tag_id];
          }
        }

        let temp_recipe: RecipeIface = {
          ...res[i],
          ingredients: ingredientsList,
          tags: tagsList,
          is_external: false,
        };

        temp_recipes.push(temp_recipe);
      }

      temp_recipes.sort((a, b) => sortRecipes(a, b));
      dispatch(setRecipeList(temp_recipes));
    };

    if (globalRecipes.length === 0) {
      fetchRecipes();
    }
  }, []);

  useEffect(() => {
    if (onlyShowExternal) {
      dispatch(setSelectedMealType(""));
      dispatch(setSelectedTags([]));
      dispatch(setSelectedIngredients([]));
      dispatch(setSelectedAdvancedIngredients([]));
    }
  }, [onlyShowExternal]);

  useEffect(() => {
    if (onlyShowExternal) {
      const recipeList = [];
      for (let i = 0; i < globalRecipes.length; i++) {
        if (globalRecipes[i].is_external) {
          recipeList.push(globalRecipes[i]);
        }
      }
      setFilteredRecipes(recipeList);
    } else {
      const filterIngredients = (ingredients: any) => {
        for (let i = 0; i < selectedIngredients.length; i++) {
          if (ingredients && !ingredients.includes(selectedIngredients[i].id)) {
            return false;
          }
        }
        return true;
      };

      const hasTag = (tags: number[], name: string) => {
        for (let j = 0; j < tags.length; j++) {
          if (allTags.some((tag) => tag.id === tags[j] && tag.name === name)) {
            return true;
          }
        }
        return false;
      };

      const filterTags = (tags: number[]) => {
        for (let i = 0; i < selectedTags.length; i++) {
          if (tags && !tags.includes(selectedTags[i].id)) {
            if (selectedTags[i].name === "vegetarian") {
              if (hasTag(tags, "pescetarian")) {
                return true;
              } else if (hasTag(tags, "vegan")) {
                return true;
              }
            } else if (selectedTags[i].name === "pescetarian") {
              if (hasTag(tags, "vegan")) {
                return true;
              }
            }
            return false;
          }
        }
        return true;
      };

      const filterMealType = (type: string) => {
        if (selectedMealType === "" || type === selectedMealType) {
          return true;
        }
        return false;
      };

      const filterBySearchStr = (title: any) => {
        if (search_str === undefined || search_str.length === 0) {
          return true;
        }
        return title.toLowerCase().includes(search_str.toLowerCase());
      };

      setFilteredRecipes([]);
      const recipeList = [];
      for (let i = 0; i < globalRecipes.length; i++) {
        if (
          globalRecipes[i].is_external &&
          (selectedIngredients.length > 0 || selectedTags.length > 0)
        ) {
          continue;
        }
        if (
          filterIngredients(globalRecipes[i].ingredients) &&
          filterTags(globalRecipes[i].tags ?? []) &&
          filterMealType(globalRecipes[i].meal_type || "") &&
          filterBySearchStr(globalRecipes[i].title)
        ) {
          let new_recipe = { ...globalRecipes[i], ingredient_matches: 0 };

          recipeList.push(new_recipe);
        }
      }
      setFilteredRecipes(recipeList);
    }
  }, [
    onlyShowExternal,
    selectedIngredients,
    selectedTags,
    selectedMealType,
    search_str,
    globalRecipes,
    dispatch,
  ]);

  useEffect(() => {
    if (filteredRecipes !== null && filteredRecipes.length !== 0) {
      setLoading(true);
      const getFilteredRecipes = async () => {
        // Simulate an async operation, e.g., fetching data
        const content = await new Promise<JSX.Element>((resolve) =>
          setTimeout(
            () => resolve(<FilteredRecipeList content={filteredRecipes} />),
            0
          )
        );

        return content;
      };

      const fetchContent = async () => {
        const loadedContent = await getFilteredRecipes();
        setContent(loadedContent);
      };

      fetchContent();
      setLoading(false);
      setGlobalLoading(false);
    }
  }, [filteredRecipes, dispatch]);

  const [content, setContent] = React.useState<JSX.Element | null>(null);

  useEffect(() => {
    dispatch(setGlobalLoading(true));
    const fetchTags = async () => {
      const iface = new ServerIface();

      iface.get("tags").then((res) => {
        if (res !== undefined) {
          setTags(res);
        }
      });
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (content !== null) {
      dispatch(setGlobalLoading(false));
    }
  }, [dispatch, content]);

  const navigate = useNavigate();

  function handleClickAdd() {
    navigate("/NewRecipe");
  }

  return (
    <div>
      {user_token && (
        <div className="SideButtonsContainer">
          <div className="SvgButton PlusButtonContainer">
            <img
              src={PlusIcon}
              alt="PlusIcon"
              className="SvgIcon"
              onClick={handleClickAdd}
            />
          </div>
        </div>
      )}
      <div id="FiltersBarContainer">
        <FiltersBar />
      </div>
      <div className="RecipeList">
        {filteredRecipes.length === 0 ? (
          <div className="NoResults">
            <p>No results</p>
          </div>
        ) : (
          <div className="RecipesContainer">
            {!loading && content && content}
            <p className="ResultCount">{filteredRecipes.length} results</p>
          </div>
        )}
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
  );
};

export default RecipeList;
