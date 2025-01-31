import { Component } from "react";
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
  author: String;
  imageBase64: String;
  imageSet: boolean;
}

function FormatDate(date: string) {
  var year = date.split("-")[0];
  var month = date.split("-")[1];
  var day = date.split("-")[2].split("T")[0];

  var formatted_date = day + "/" + month + "/" + year;
  return formatted_date;
}
export class RecipeCard extends Component<RecipeCardProps, RecipeCardStates> {
  constructor(props: RecipeCardProps) {
    super(props);
    this.state = {
      author: "N/A",
      imageBase64: "",
      imageSet: false,
    };
  }

  componentDidMount() {
    const iface = new ServerIface();
    iface
      .get_search("user", this.props.recipe_object.user_id.toLocaleString())
      .then((response) => {
        if (response[0].display_name !== undefined) {
          this.setState({ author: response[0].display_name });
        }
      });

    if (this.props.recipe_object.image === "") {
      return;
    }

    iface.getImage(this.props.recipe_object.image).then((image_response) => {
      if (image_response === undefined) {
        console.log("Image not found");
      } else {
        this.setState({ imageBase64: image_response });
        this.setState({ imageSet: true });
      }
    });
  }

  render() {
    const recipeCardClasses = classNames("RecipeCardContainer", {
      RecipeCardDisabled: this.props.disabled,
    });
    if (this.props.disabled) {
      return (
        <div className={recipeCardClasses}>
          <div className="RecipeCardImageContainer">
            {this.state.imageSet ? (
              <img
                src={`data:image/jpg;base64,${this.state.imageBase64}`}
                alt="Recipe"
              />
            ) : (
              <img src={missing_picture_placeholder} alt="Recipe" />
            )}
          </div>
          <div className="RecipeCardContentContainer">
            <div className="RecipeCardTitleContainer">
              <h3 className="RecipeCardTitle">
                {Capitalize(this.props.recipe_object.title)}
              </h3>
            </div>
            <div className="RecipeCardAuthorInfo">
              <p>By: {Capitalize(this.state.author.toString())}</p>
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
          {this.state.imageSet ? (
            <img
              src={`data:image/jpg;base64,${this.state.imageBase64}`}
              alt="Recipe"
            />
          ) : (
            <img src={missing_picture_placeholder} alt="Recipe" />
          )}
        </div>
        <div className="RecipeCardContentContainer">
          <div className="RecipeCardTitleContainer">
            <h3 className="RecipeCardTitle">
              {Capitalize(this.props.recipe_object.title)}
            </h3>
          </div>
          <div className="RecipeCardAuthorInfo">
            <p>By: {Capitalize(this.state.author.toString())}</p>
            <p>{FormatDate(this.props.recipe_object.created_at)}</p>
          </div>
        </div>
      </NavLink>
    );
  }
}
