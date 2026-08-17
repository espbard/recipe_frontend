import { Component } from "react";
import ServerIface from "../../../ServerIface";
import "./RecipeCard.scss";
import RecipeImage from "../../atoms/RecipeImage/RecipeImage";
import CheckIcon from "../../../assets/images/check.svg";
import CrossIcon from "../../../assets/images/cross.svg";
import ListIcon from "../../../assets/images/list.svg";
import { NavLink } from "react-router-dom";
import { Capitalize } from "../../../common/common";
import classNames from "classnames";
import { RecipeIface } from "../../../common/common";

interface RecipeCardProps {
  recipe_object: RecipeIface;
  disabled?: boolean;
  advanced_ingredient_matches?: number;
  advanced_ingredient_misses?: number;
  ingredients_outside_matches?: number;
}

interface RecipeCardStates {
  author: string;
  ingredients: string[];
}

function FormatDate(date: string) {
  var year = date.split("-")[0];
  var month = date.split("-")[1];
  var day = date.split("-")[2];

  var formatted_date = day + "." + month + "." + year;
  return formatted_date;
}

export class RecipeCard extends Component<RecipeCardProps, RecipeCardStates> {
  constructor(props: RecipeCardProps) {
    super(props);
    this.state = {
      author: "N/A",
      ingredients: [],
    };
  }

  componentDidMount() {
    const iface = new ServerIface();
    if (
      this.props.recipe_object !== undefined &&
      this.props.recipe_object.user_id !== undefined
    ) {
      let user_id = this.props.recipe_object.user_id || -1;
      iface.get_search("user", user_id.toLocaleString()).then((response) => {
        if (
          response !== undefined &&
          response[0] !== undefined &&
          response[0].display_name !== undefined
        ) {
          this.setState({ author: response[0].display_name });
        }
      });
    }
  }

  render() {
    const recipeCardClasses = classNames("RecipeCardContainer", {
      Breakfast: this.props.recipe_object.meal_type === "Breakfast",
      Lunch: this.props.recipe_object.meal_type === "Lunch",
      Soup: this.props.recipe_object.meal_type === "Soup",
      Dinner: this.props.recipe_object.meal_type === "Dinner",
      Dessert: this.props.recipe_object.meal_type === "Dessert",
      Baked: this.props.recipe_object.meal_type === "Baked",
      Snack: this.props.recipe_object.meal_type === "Snack",
      Side: this.props.recipe_object.meal_type === "Side",
      External: this.props.recipe_object.is_external,
    });

    const recipe_page_id = this.props.recipe_object.is_external
      ? "e" + this.props.recipe_object.id
      : this.props.recipe_object.id;

    return (
      <NavLink to={"/recipe/" + recipe_page_id} className={recipeCardClasses}>
        <div className="RecipeCardImageContainer">
          <RecipeImage image={this.props.recipe_object.image} alt="Recipe" />
        </div>
        <div className="RecipeCardContentContainer">
          <div className="RecipeCardTitleContainer">
            <h3 className="RecipeCardTitle">
              {Capitalize(this.props.recipe_object.title)}
            </h3>
          </div>
          {this.props.advanced_ingredient_matches !== undefined && (
            <div className="RecipeCardMatchesRow">
              <h3 className="RecipeCardMatchesTitle">Matches:</h3>
              <h3 className="RecipeCardMatchItem RecipeCardMatches">
                <p>{this.props.advanced_ingredient_matches}</p>
                <img src={CheckIcon} />
              </h3>
              <h3 className="RecipeCardMatchItem RecipeCardMisses">
                <p>{this.props.advanced_ingredient_misses}</p>
                <img src={CrossIcon} />
              </h3>
              <h3 className="RecipeCardMatchItem RecipeCardUnknown">
                <p>{this.props.ingredients_outside_matches}</p>
                <img src={ListIcon} />
              </h3>
            </div>
          )}
          {!this.props.recipe_object.is_external && (
            <div className="RecipeCardAuthorInfo">
              <p>
                By: <b> {Capitalize(this.state.author.toString())}</b>
              </p>
              {this.props.recipe_object.created_at !== undefined &&
                this.props.recipe_object.created_at !== null && (
                  <p>{FormatDate(this.props.recipe_object.created_at)}</p>
                )}
            </div>
          )}
        </div>
      </NavLink>
    );
  }
}
