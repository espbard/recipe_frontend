import React, { useEffect, useState } from "react";
import ServerIface from "../../../ServerIface";
import { RecipeCard } from "../RecipeCard/RecipeCard";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";
import "./RecipeList.scss";
import { CustomButton } from "../../atoms/CustomButton/CustomButton";
import { Icon } from "../../../common/common";

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const selectedIngredients = useAppSelector(
    (state) => state.global.selectedIngredients
  );
  const selectedTags = useAppSelector((state) => state.global.selectedTags);
  const search_str = useAppSelector((state) => state.global.search_str);
  const sidebarCollapsed = useAppSelector(
    (state) => state.global.sidebarCollapsed
  );

  useEffect(() => {
    const fetchRecipes = async () => {
      const iface = new ServerIface();
      const data = iface.get("recipes");

      let recipes: any[] = [];

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
        const recipe_ingredients = iface.get("recipe_ingredients/" + res[i].id);

        let recipe_i_res = await recipe_ingredients.then((res: any) => res);
        for (let j = 0; j < recipe_i_res.length; j++) {
          let ingredient_id = recipe_i_res[j].ingredient_id;

          const ingredient = iface.get("ingredients/" + ingredient_id);
          let i_res = await ingredient.then((res: any) => res);
          ingredientsList.push(i_res.name);
        }

        var tagsList: string[] = [];
        const recipe_tags = iface.get("recipe_tags/" + res[i].id);
        let recipe_t_res = await recipe_tags.then((res: any) => res);
        for (let j = 0; j < recipe_t_res.length; j++) {
          let tag_id = recipe_t_res[j].tag_id;

          const tag = iface.get("tags/" + tag_id);
          let t_res = await tag.then((res: any) => res);
          tagsList.push(t_res.name);
        }

        recipes.push({
          ...res[i],
          ingredients: ingredientsList,
          tags: tagsList,
        });
      }
      setRecipes(recipes);
    };

    fetchRecipes();
  }, []);

  const navigate = useNavigate();

  function handleClick() {
    navigate("/NewRecipe");
  }

  const filterBySearchStr = (recipe: any) => {
    if (search_str === undefined) {
      return true;
    }
    return recipe.title.toLowerCase().includes(search_str.toLowerCase());
  };

  const filterRecipeByIngredients = (recipe: any) => {
    for (let i = 0; i < selectedIngredients.length; i++) {
      if (!recipe.ingredients.includes(selectedIngredients[i].name)) {
        return false;
      }
    }
    return true;
  };

  const filterRecipeByTags = (recipe: any) => {
    for (let i = 0; i < selectedTags.length; i++) {
      if (!recipe.tags.includes(selectedTags[i].name)) {
        return false;
      }
    }
    return true;
  };

  const filterRecipe = (recipe: any) => {
    return (
      filterRecipeByIngredients(recipe) &&
      filterRecipeByTags(recipe) &&
      filterBySearchStr(recipe)
    );
  };

  return (
    <div>
      {sidebarCollapsed ? (
        <div className="NewRecipeButtonContainer">
          <CustomButton
            label={Icon.Add}
            onClick={handleClick}
            round
            size="large"
          />
        </div>
      ) : (
        <div className="DisabledButton">
          <CustomButton
            label={Icon.Add}
            onClick={() => {}}
            round
            size="large"
          />
        </div>
      )}
      <div className="RecipeList">
        {recipes.map((recipe) => {
          if (filterRecipe(recipe)) {
            return (
              <RecipeCard
                key={recipe.id}
                recipe_object={recipe}
                disabled={!sidebarCollapsed}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default RecipeList;
