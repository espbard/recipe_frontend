import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import { useNavigate } from "react-router-dom";
import ServerIface from "../../ServerIface";
import "./Recipe.scss";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import { PopUp } from "../../components/molecules/PopUp/PopUp";
import missing_picture_placeholder from "../../assets/images/missing_picture_placeholder.png";
import { Tag } from "../../components/molecules/Tag/Tag";
import { Ingredient, Icon, Capitalize } from "../../common/common";

interface RecipeIface {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  instructions: string[];
  ingredients: Ingredient[];
  user_id: number;
  image: string;
  tags: string[];
  portions: number;
}

function FormatDate(date: string) {
  if (date.length > 0) {
    var year = date.split("-")[0];
    var month = date.split("-")[1];
    var day_unformatted = date.split("-")[2].split("T")[0];

    if (day_unformatted === undefined) {
      return "N/A";
    }
    var day = day_unformatted.split(" ")[0];

    var formatted_date = day + "/" + month + "/" + year;
    return formatted_date;
  } else {
    return "N/A";
  }
}

const Recipe: React.FC = () => {
  const [recipe, setRecipe] = useState<RecipeIface>({
    id: 0,
    title: "",
    description: "",
    created_at: "",
    updated_at: "",
    instructions: [],
    ingredients: [],
    user_id: 0,
    image: "",
    tags: [],
    portions: 0,
  });
  const [author, setAuthor] = useState<string>("");
  const [originalPortions, setOriginalPortions] = useState<number>(0);
  const [activePortions, setActivePortions] = useState<number>(0);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [deletePopUpVisble, setDeletePopUpVisble] = useState<boolean>(false);
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const iface = new ServerIface();
      const recipe_data = await iface.get("recipes/" + id);
      if (recipe_data === undefined) {
        return;
      }

      let response = recipe_data[0];

      let recipe: RecipeIface = {
        id: response.id,
        title: response.title,
        description: response.description,
        created_at: response.created_at,
        updated_at: response.updated_at,
        instructions: [],
        ingredients: [],
        user_id: response.user_id,
        image: response.image,
        tags: [],
        portions: response.portions,
      };

      setOriginalPortions(response.portions);
      setActivePortions(response.portions);

      const recipe_ingredients_data = await iface.get_search(
        "recipe_ingredients",
        recipe.id.toLocaleString()
      );
      if (recipe_ingredients_data === undefined) {
        return;
      }

      let recipe_ingredients_response = recipe_ingredients_data;

      for (let i = 0; i < recipe_ingredients_response.length; i++) {
        const ingredient_data = await iface.get_search(
          "ingredient",
          recipe_ingredients_response[i].ingredient_id.toLocaleString()
        );

        if (ingredient_data === undefined) {
          return;
        }

        recipe.ingredients.push({
          name: ingredient_data[0].name,
          quantity: recipe_ingredients_response[i].quantity,
          unit: recipe_ingredients_response[i].unit,
        });
      }

      const recipe_instructions_data = await iface.get_search(
        "recipe_instructions",
        recipe.id.toLocaleString()
      );
      if (recipe_instructions_data === undefined) {
        return;
      }

      let recipe_instructions_response = recipe_instructions_data;

      for (let i = 0; i < recipe_instructions_response.length; i++) {
        const instruction_data = await iface.get_search(
          "instruction",
          recipe_instructions_response[i].instruction_id
        );

        if (instruction_data === undefined) {
          return;
        }

        recipe.instructions.push(instruction_data[0].description);
      }

      const recipe_tags_data = await iface.get_search(
        "recipe_tags",
        recipe.id.toLocaleString()
      );
      if (recipe_tags_data === undefined) {
        return;
      }

      let recipe_tags_response = recipe_tags_data;

      for (let i = 0; i < recipe_tags_response.length; i++) {
        const tag_data = await iface.get_search(
          "tag",
          recipe_tags_response[i].tag_id
        );
        if (tag_data === undefined) {
          return;
        } else {
          recipe.tags.push(tag_data[0].name);
        }
      }

      if (recipe.image.length !== 0) {
        let image_response = await iface.getImage(recipe.image);
        setImageBase64(image_response);
      }

      setRecipe(recipe);
    };

    const fetchAuthor = async () => {
      const iface = new ServerIface();
      const data = await iface.get("users/" + recipe.user_id);
      if (data === undefined) {
        return;
      }
      setAuthor(data[0].display_name);
    };

    fetchRecipe();
    if (recipe.user_id === 0) return;
    fetchAuthor();
  }, [recipe.user_id, id]);

  const toggleDeletePopUp = () => {
    setDeletePopUpVisble(!deletePopUpVisble);
  };

  const getIngredientMultiplier = () => {
    if (originalPortions === 0) {
      return 1;
    }
    return activePortions / originalPortions;
  };

  const getMultipliedIngredients = (quantity: number) => {
    let multiplied_num = (quantity *= getIngredientMultiplier());
    return Math.round(multiplied_num * 100) / 100;
  };

  const deleteRecipe = async () => {
    const iface = new ServerIface();
    const data = await iface.delete("recipes/" + id);
    if (data === undefined) {
      return;
    }
    setDeletePopUpVisble(false);
    navigate("/");
  };

  return (
    <PageTemplate
      content={
        <div className="RecipeContainer">
          {deletePopUpVisble && (
            <PopUp
              title="Delete Recipe"
              text="Are you sure you want to delete this recipe?"
              leftButtonText="Delete"
              rightButtonText="Cancel"
              onClickLeft={deleteRecipe}
              onClickRight={toggleDeletePopUp}
            />
          )}

          <div className="RecipeImageContainer">
            {imageBase64.length > 0 ? (
              <img src={`data:image/jpg;base64,${imageBase64}`} alt="Recipe" />
            ) : (
              <img src={missing_picture_placeholder} alt="Recipe" />
            )}
          </div>
          <div className="Recipe">
            <div className="RecipeRow" id="RecipeTitleContainer">
              <div className="RecipeTitle">
                <h3>
                  {recipe.title.charAt(0).toUpperCase() +
                    recipe.title.slice(1).toLocaleLowerCase()}
                </h3>
              </div>
            </div>

            <div className="RecipeRow">
              <div className="PortionsContainer">
                <h4 className="PortionsLabel">Serves:</h4>
                <h2 className="Portions">{activePortions}</h2>
                <div className="PortionsButtonsContainer">
                  <div className="PortionsButtonContainer">
                    <CustomButton
                      label={Icon.ChevronUp}
                      onClick={() => {
                        activePortions < 99 &&
                          setActivePortions(activePortions + 1);
                      }}
                      size="xsmall"
                    />
                  </div>
                  <div className="PortionsButtonContainer">
                    <CustomButton
                      label={Icon.ChevronDown}
                      onClick={() => {
                        activePortions > 1 &&
                          setActivePortions(activePortions - 1);
                      }}
                      size="xsmall"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="RecipeTitleUnderLine" />
            <div className="RecipeRow" id="RecipeDescriptionContainer">
              <div>
                <h4 className="RecipeSubTitle">Description:</h4>
                <h6 className="RecipeDescription">{recipe.description}</h6>
              </div>
            </div>
            <div className="RecipeRow" id="RecipIngredientsContainer">
              <div>
                <h4 className="RecipeSubTitle">Ingredients:</h4>
                <div>
                  <div className="RecipeIngredients">
                    <ul>
                      {recipe.ingredients.map((ingredient) => {
                        return (
                          <li key={ingredient.name}>
                            {getMultipliedIngredients(ingredient.quantity)}{" "}
                            {ingredient.unit} {Capitalize(ingredient.name)}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="RecipeRow" id="RecipInstructionsContainer">
              <h4 className="RecipeSubTitle">Instructions:</h4>
              <ol className="RecipeInstructions">
                {recipe.instructions.map((instruction) => {
                  return <li key={instruction}>{Capitalize(instruction)}</li>;
                })}
              </ol>
            </div>
            <div className="RecipeRow" id="RecipInstructionsContainer">
              <div className="TagsContainer">
                {recipe.tags.map((tag) => (
                  <Tag key={tag} id={0} text={tag} />
                ))}
              </div>
            </div>
            <div id="RecipeInfoContainer">
              <div className="RecipeInfo">
                <p>Uploaded by: </p>
                <p>{Capitalize(author)}</p>
              </div>
              <div className="RecipeInfo" style={{ justifyContent: "center" }}>
                <p>Last updated: </p>
                <p>{FormatDate(recipe.updated_at)}</p>
              </div>
              <div
                className="RecipeInfo"
                style={{ justifyContent: "flex-end" }}
              >
                <p>Created: </p>
                <p>{FormatDate(recipe.created_at)}</p>
              </div>
            </div>
          </div>
          <div className="RecipeButtonsContainer">
            <div className="OneHalf">
              <CustomButton
                onClick={() => {
                  navigate("/recipe/edit/" + id);
                }}
                label={Icon.Edit}
              />
            </div>
            <div className="OneHalf">
              <CustomButton
                onClick={toggleDeletePopUp}
                label={Icon.Delete}
                background="red"
                color="almost-white"
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Recipe;
