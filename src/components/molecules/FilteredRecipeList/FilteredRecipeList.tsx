import React from "react";
import { RecipeCard } from "../../organisms/RecipeCard/RecipeCard";
import { RecipeIface } from "../../../common/common";
import "./FilteredRecipeList.scss";
import { Icon } from "../../../common/common";
import { useAppSelector } from "../../../redux/hooks";

interface FilteredRecipesProps {
  content: RecipeIface[];
}
const ITEMS_PER_PAGE = 10;

const FilteredRecipeList: React.FC<FilteredRecipesProps> = ({ content }) => {
  const [page, setPage] = React.useState(1);

  const ingredientsSelected = useAppSelector(
    (state) => state.global.selectedAdvancedIngredients
  );

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedContent = content.slice(start, end);

  const sortRecipes = (a: number, b: number) => {
    if (ingredientsSelected !== undefined && ingredientsSelected.length > 0) {
      return a - b;
    }

    return 0;
  };

  return (
    <>
      {paginatedContent
        .map((recipe) => {
          let ingredient_matches: number | undefined = 0;
          let ingredient_misses: number = 0;
          let ingredient_unknown: number = 0;

          if (
            ingredientsSelected === undefined ||
            ingredientsSelected.length === 0
          ) {
            ingredient_matches = undefined;
          } else if (
            recipe.ingredients !== undefined &&
            recipe.ingredients !== null
          ) {
            for (let k = 0; k < ingredientsSelected.length; k++) {
              let ingredient_found = false;
              for (let l = 0; l < recipe.ingredients.length; l++) {
                let ingredient_id: number = recipe.ingredients[l];
                let selected_ingredient: number = ingredientsSelected[k].id;

                if (ingredient_id === selected_ingredient) {
                  ingredient_found = true;
                  continue;
                }
              }
              if (!ingredient_found) {
                ingredient_misses += 1;
              } else {
                if (ingredient_matches === undefined) {
                  ingredient_matches = 1;
                } else {
                  ingredient_matches += 1;
                }
              }
            }
          }

          if (recipe.ingredients !== undefined && recipe.ingredients !== null) {
            ingredient_unknown =
              recipe.ingredients.length - (ingredient_matches || 0);
          }

          const sortingScore = (ingredient_matches || 0) - ingredient_misses;

          return {
            recipe,
            ingredient_matches,
            ingredient_misses,
            ingredient_unknown,
            sortingScore,
          };
        })
        .sort((a, b) => sortRecipes(a.ingredient_unknown, b.ingredient_unknown))
        .sort((a, b) => sortRecipes(b.sortingScore, a.sortingScore))
        .map(
          ({
            recipe,
            ingredient_matches,
            ingredient_misses,
            ingredient_unknown,
          }) => (
            <RecipeCard
              key={recipe.is_external ? "e" + recipe.id : recipe.id}
              recipe_object={recipe}
              advanced_ingredient_matches={ingredient_matches}
              advanced_ingredient_misses={ingredient_misses}
              ingredients_outside_matches={ingredient_unknown}
            />
          )
        )}
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="left-button"
        >
          {Icon.ChevronLeft}
        </button>
        <p>
          Page {page} of {Math.ceil(content.length / ITEMS_PER_PAGE)}
        </p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(content.length / ITEMS_PER_PAGE)}
          className="right-button"
        >
          {Icon.ChevronRight}
        </button>
      </div>
    </>
  );
};

export default FilteredRecipeList;
