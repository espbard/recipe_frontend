import { Component, SyntheticEvent } from "react";
import ServerIface from "../../../ServerIface";
import "./RecipeCard.scss";
import missing_picture_placeholder from "../../../assets/images/missing_picture_placeholder.png";
import { NavLink } from "react-router-dom";
import { Capitalize } from "../../../common/common";
import classNames from "classnames";

interface RecipeIface {
  id: number;
  title: string;
  description: string;
  created_at: string;
  user_id: number;
  image: string;
}

interface RecipeCardProps {
  recipe_object: RecipeIface;
  disabled?: boolean;
}

interface RecipeCardStates {
  author: string;
  image: string;
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
      image: "",
    };
  }

  componentDidMount() {
    const iface = new ServerIface();
    if (
      this.props.recipe_object !== undefined &&
      this.props.recipe_object.user_id !== undefined
    ) {
      let user_id = this.props.recipe_object.user_id;
      iface.get_search("user", user_id.toLocaleString()).then((response) => {
        if (response[0].display_name !== undefined) {
          this.setState({ author: response[0].display_name });
        }
      });
    }

    if (this.props.recipe_object.image === "") {
      return;
    }

    const cdn_url = iface.getCdn();

    this.setState({ image: cdn_url + this.props.recipe_object.image });
  }

  render() {
    const recipeCardClasses = classNames("RecipeCardContainer", {
      RecipeCardDisabled: this.props.disabled,
    });
    const addImageFallback = (
      event: SyntheticEvent<HTMLImageElement, Event>
    ) => {
      event.currentTarget.src = missing_picture_placeholder;
    };

    if (this.props.disabled) {
      return (
        <div className={recipeCardClasses}>
          <div className="RecipeCardImageContainer">
            <img
              src={this.state.image}
              alt="Recipe"
              onError={addImageFallback}
            />
          </div>
          <div className="RecipeCardContentContainer">
            <div className="RecipeCardTitleContainer">
              <h3 className="RecipeCardTitle">
                {Capitalize(this.props.recipe_object.title)}
              </h3>
            </div>
            <div className="RecipeCardAuthorInfo">
              <p>
                By: <b>{Capitalize(this.state.author.toString())}</b>
              </p>
              <p>{FormatDate(this.props.recipe_object.created_at)}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <NavLink
        to={"/recipe/" + this.props.recipe_object.id}
        className="RecipeCardContainer"
      >
        <div className="RecipeCardImageContainer">
          <img src={this.state.image} alt="Recipe" onError={addImageFallback} />
        </div>
        <div className="RecipeCardContentContainer">
          <div className="RecipeCardTitleContainer">
            <h3 className="RecipeCardTitle">
              {Capitalize(this.props.recipe_object.title)}
            </h3>
          </div>
          <div className="RecipeCardAuthorInfo">
            <p>
              By: <b> {Capitalize(this.state.author.toString())}</b>
            </p>
            <p>{FormatDate(this.props.recipe_object.created_at)}</p>
          </div>
        </div>
      </NavLink>
    );
  }
}
