import React from "react";
import RecipeList from "../../components/organisms/RecipeList/RecipeList";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import "./Home.scss";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../../redux/globalSlice";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  const [content, setContent] = React.useState<JSX.Element | null>(null);

  React.useEffect(() => {
    const getRecipes = async () => {
      dispatch(setGlobalLoading(true));

      // Simulate an async operation, e.g., fetching data
      const content = await new Promise<JSX.Element>((resolve) =>
        setTimeout(() => resolve(<RecipeList key="recipe-list" />), 1000)
      );

      dispatch(setGlobalLoading(false));
      return content;
    };

    const fetchContent = async () => {
      const loadedContent = await getRecipes();
      setContent(loadedContent);
    };

    fetchContent();
  }, [dispatch]);

  return <PageTemplate content={content ?? <div />} />;
};

export default Home;
