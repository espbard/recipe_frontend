import React from "react";
import { RecipeCard } from "../../organisms/RecipeCard/RecipeCard";

interface FilteredRecipesProps {
  content: any[];
}

const FilteredRecipeList: React.FC<FilteredRecipesProps> = ({ content }) => {
  return (
    <>
      {content.map((recipe) => {
        return <RecipeCard key={recipe.id} recipe_object={recipe} />;
      })}
    </>
  );
};

export default FilteredRecipeList;
