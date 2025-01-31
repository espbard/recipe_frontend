import RecipeList from "../../components/organisms/RecipeList/RecipeList";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import "./Home.scss";

const Home = () => {
  return <PageTemplate content={<RecipeList />} />;
};

export default Home;
