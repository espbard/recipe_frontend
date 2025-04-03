import React, { useEffect, useState } from "react";
import ServerIface from "../../../ServerIface";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import "./RecipeList.scss";
import { CustomButton } from "../../atoms/CustomButton/CustomButton";
import { Icon } from "../../../common/common";
import FiltersBar from "../FiltersBar/FiltersBar";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../../../redux/globalSlice";
import FilteredRecipeList from "../../molecules/FilteredRecipeList/FilteredRecipeList";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const search_str = useAppSelector((state) => state.global.search_str);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRecipes = async () => {
      const iface = new ServerIface();
      const data = iface.get("recipes");

      let temp_recipes: any[] = [];

      if (data === undefined) {
        return;
      }

      let res = await data.then((res: any) => {
        if (res === undefined) {
          return [];
        }
        return res;
      });
      for (let i = 0; i < res.length; i++) {
        var ingredientsList: string[] = [];
        const recipe_ingredients = iface.get_search(
          "recipe_ingredients",
          res[i].id
        );

        let recipe_i_res = await recipe_ingredients.then((res: any) => {
          return res;
        });

        for (let j = 0; j < recipe_i_res.length; j++) {
          let ingredient_id = recipe_i_res[j].ingredient_id;

          const ingredient = iface.get_search("ingredient", ingredient_id);
          let i_res = await ingredient.then((res: any) => {
            return res;
          });

          for (let k = 0; k < i_res.length; k++) {
            ingredientsList.push(i_res[k].name);
          }
        }

        var tagsList: string[] = [];
        const recipe_tags = iface.get_search("recipe_tags", res[i].id);
        let recipe_t_res = await recipe_tags.then((res: any) => res);
        for (let j = 0; j < recipe_t_res.length; j++) {
          let tag_id = recipe_t_res[j].tag_id;

          const tag = iface.get_search("tag", tag_id);
          let t_res = await tag.then((res: any) => res);

          for (let k = 0; k < t_res.length; k++) {
            tagsList.push(t_res[k].name);
          }
        }

        temp_recipes.push({
          ...res[i],
          ingredients: ingredientsList,
          tags: tagsList,
        });
      }

      setRecipes(temp_recipes);
    };

    fetchRecipes();
  }, []);

  const filterIngredients = (ingredients: any) => {
    for (let i = 0; i < selectedIngredients.length; i++) {
      if (!ingredients.includes(selectedIngredients[i].name)) {
        return false;
      }
    }
    return true;
  };

  const filterTags = (tags: any) => {
    for (let i = 0; i < selectedTags.length; i++) {
      if (!tags.includes(selectedTags[i].name)) {
        return false;
      }
    }
    return true;
  };

  const filterBySearchStr = (title: any) => {
    if (search_str === undefined || search_str.length === 0) {
      return true;
    }
    return title.toLowerCase().includes(search_str.toLowerCase());
  };

  useEffect(() => {
    setFilteredRecipes([]);
    const recipeList = [];
    for (let i = 0; i < recipes.length; i++) {
      if (
        filterIngredients(recipes[i].ingredients) &&
        filterTags(recipes[i].tags) &&
        filterBySearchStr(recipes[i].title)
      ) {
        recipeList.push(recipes[i]);
      }
    }
    setFilteredRecipes(recipeList);
    dispatch(setGlobalLoading(false));
  }, [selectedIngredients, selectedTags, search_str, recipes]);

  useEffect(() => {
    const fetchContent = async () => {
      const loadedContent = await getFilteredRecipes();
      setContent(loadedContent);
    };

    fetchContent();
  }, [filteredRecipes]);

  const getFilteredRecipes = async () => {
    dispatch(setGlobalLoading(true));

    // Simulate an async operation, e.g., fetching data
    const content = await new Promise<JSX.Element>((resolve) =>
      setTimeout(
        () => resolve(<FilteredRecipeList content={filteredRecipes} />),
        1000
      )
    );

    dispatch(setGlobalLoading(false));
    return content;
  };

  const [content, setContent] = React.useState<JSX.Element | null>(null);

  const navigate = useNavigate();

  function handleClick() {
    navigate("/NewRecipe");
  }

  return (
    <div>
      <div className="NewRecipeButtonContainer">
        <CustomButton
          label={Icon.Add}
          onClick={handleClick}
          round
          size="large"
        />
      </div>

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
            {content}
            {/* {filteredRecipes.map((recipe) => {
              return <RecipeCard key={recipe.id} recipe_object={recipe} />;
            })} */}
            <p>{filteredRecipes.length} results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
