import React from "react";
import { RecipeCard } from "../../organisms/RecipeCard/RecipeCard";
import "./FilteredRecipeList.scss";
import { Icon } from "../../../common/common";

interface FilteredRecipesProps {
  content: any[];
}
const ITEMS_PER_PAGE = 10;

const FilteredRecipeList: React.FC<FilteredRecipesProps> = ({ content }) => {
  const [page, setPage] = React.useState(1);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedContent = content.slice(start, end);

  return (
    <>
      {paginatedContent.map((recipe) => {
        return <RecipeCard key={recipe.id} recipe_object={recipe} />;
      })}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          {Icon.ChevronLeft}
        </button>
        <p>
          Page {page} of {Math.ceil(content.length / ITEMS_PER_PAGE)}
        </p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= Math.ceil(content.length / ITEMS_PER_PAGE)}
        >
          {Icon.ChevronRight}
        </button>
      </div>
    </>
  );
};

export default FilteredRecipeList;
