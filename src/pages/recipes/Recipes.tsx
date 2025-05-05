import React from "react";
import RecipeList from "../../components/organisms/RecipeList/RecipeList";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import "./Recipes.scss";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../../redux/globalSlice";

const Recipes: React.FC = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = React.useState(true);
  const [content, setContent] = React.useState<JSX.Element | null>(null);

  React.useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      dispatch(setGlobalLoading(true));

      // Simulate an async operation, e.g., fetching data
      const content = await new Promise<JSX.Element>((resolve) => {
        setTimeout(() => resolve(<RecipeList key="recipe-list" />), 0);
      });

      setLoading(false);
      dispatch(setGlobalLoading(false));
      return content;
    };

    const fetchContent = async () => {
      const loadedContent = await getRecipes();
      setContent(loadedContent);
    };

    fetchContent();
  }, [dispatch]);

  return (
    <PageTemplate
      content={!loading && content ? content : <div key="loading"></div>}
    />
  );
};

export default Recipes;
