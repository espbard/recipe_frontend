import React from "react";
import "./Home.scss";
import PageLinkBox from "../../components/organisms/PageLinkBox/PageLinkBox";
import { useNavigate } from "react-router-dom";
import RecipeImg from "../../assets/images/recipe-svgrepo-com.svg";
import CalendarImg from "../../assets/images/calendar-icon.svg";
import ShoppingListImg from "../../assets/images/shopping_list.svg";
import BlockImg from "../../assets/images/block-svgrepo-com.svg";
import Cookies from "js-cookie";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const tokenCookie = Cookies.get("token");

  return (
    <div className="PageLinkGrid">
      <PageLinkBox
        text="Recipes"
        color="green"
        img={RecipeImg}
        onClick={() => {
          navigate("/recipes");
        }}
      />
      <PageLinkBox
        text="Calendar"
        color="red"
        disabled={!tokenCookie}
        img={CalendarImg}
        onClick={() => {
          navigate("/calendar");
        }}
      />
      <PageLinkBox
        text="Shopping List"
        color="yellow"
        disabled={!tokenCookie}
        img={ShoppingListImg}
        onClick={() => {
          navigate("/shoppinglist");
        }}
      />
      <PageLinkBox text="" color="unused" img={BlockImg} onClick={() => {}} />
    </div>
  );
};

export default Home;
