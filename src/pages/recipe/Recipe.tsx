import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import { useNavigate } from "react-router-dom";
import ServerIface from "../../ServerIface";
import "./Recipe.scss";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import RecipeImage from "../../components/atoms/RecipeImage/RecipeImage";
import TrashIcon from "../../assets/images/trash-bin-trash-svgrepo-com.svg";
import PenIcon from "../../assets/images/pen-svgrepo-com.svg";
import { Tag } from "../../components/molecules/Tag/Tag";
import {
  Ingredient,
  Icon,
  Capitalize,
  PopUpFunctions,
  Instruction,
} from "../../common/common";
import { useAppDispatch } from "../../redux/hooks";
import { setGlobalLoading, setPopup } from "../../redux/globalSlice";
import classNames from "classnames";
import Cookies from "js-cookie";

import InstagramIcon from "../../assets/images/instagram-svgrepo-com.svg";
import LinkIcon from "../../assets/images/link-alt-1-svgrepo-com.svg";

interface RecipeIfaceWorking {
  id: number;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  instructions: Instruction[] | null;
  tags: string[] | null;
  image: string | null;
  portions: number | null;
  created_at: string | null;
  updated_at: string | null;
  meal_type: string | null;
  user_id: number | null;
  link: string | null;
  is_external: boolean | null;
}

function FormatDate(date: string) {
  const year = date.split("-")[0];
  const month = date.split("-")[1];
  const day = date.split("-")[2];

  const formatted_date = day + "." + month + "." + year;
  return formatted_date;
}

const Recipe: React.FC = () => {
  const [recipe, setRecipe] = useState<RecipeIfaceWorking>({
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
    meal_type: "",
    link: "",
    is_external: false,
  });
  const [author, setAuthor] = useState<string>("");
  const [originalPortions, setOriginalPortions] = useState<number>(0);
  const [activePortions, setActivePortions] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [mealType, setMealType] = useState<string>("");
  const { id } = useParams();
  const is_external = id?.startsWith("e");
  const dispatch = useAppDispatch();
  const tokenCookie = Cookies.get("token");

  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (recipe.link === undefined || recipe.link === null) {
      return;
    } else {
      if (
        recipe.link.toLowerCase().startsWith("http://") ||
        recipe.link.toLowerCase().startsWith("https://")
      ) {
        setUrl(recipe.link);
      } else {
        setUrl("https://" + recipe.link);
      }
    }
  }, [recipe.link]);

  useEffect(() => {
    dispatch(setGlobalLoading(true));
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      const iface = new ServerIface();
      let recipe_data;
      if (id?.startsWith("e")) {
        let ext_id = id.substring(1);
        recipe_data = await iface.get_search(
          "external_recipe",
          ext_id ? ext_id : "0"
        );
      } else {
        recipe_data = await iface.get_search("recipe", id ? id : "0");
      }
      if (recipe_data === undefined) {
        dispatch(setGlobalLoading(false));
        return;
      }

      let response = recipe_data[0];

      if (response === undefined || response.id === undefined) {
        dispatch(setGlobalLoading(false));

        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Recipe not found",
            onClickLeft: PopUpFunctions.HOME,
            leftButtonText: "Go to home",
          })
        );
        return;
      }

      let temp_recipe: RecipeIfaceWorking = {
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
        meal_type: response.meal_type ? response.meal_type : "N/A",
        link: response.link,
        is_external: is_external || false,
      };

      setOriginalPortions(response.portions);
      setActivePortions(response.portions);

      const recipe_ingredients_data = await iface.get_search(
        "recipe_ingredients",
        recipe.id.toLocaleString()
      );
      if (recipe_ingredients_data === undefined) {
        dispatch(setGlobalLoading(false));
        return;
      }

      let recipe_ingredients_response = recipe_ingredients_data;

      for (let i = 0; i < recipe_ingredients_response.length; i++) {
        const ingredient_data = await iface.get_search(
          "ingredient",
          recipe_ingredients_response[i].ingredient_id.toLocaleString()
        );

        if (ingredient_data === undefined || ingredient_data[0] === undefined) {
          continue;
        }

        if (temp_recipe.ingredients !== null) {
          temp_recipe.ingredients.push({
            name: ingredient_data[0].name,
            quantity: recipe_ingredients_response[i].quantity,
            unit: recipe_ingredients_response[i].unit,
          });
        }
      }

      const recipe_instructions_data = await iface.get_search(
        "recipe_instructions",
        temp_recipe.id.toLocaleString()
      );
      if (recipe_instructions_data === undefined) {
        dispatch(setGlobalLoading(false));
        return;
      }

      let recipe_instructions_response = recipe_instructions_data;

      for (let i = 0; i < recipe_instructions_response.length; i++) {
        const instruction_data = await iface.get_search(
          "instruction",
          recipe_instructions_response[i].instruction_id
        );

        if (instruction_data === undefined) {
          dispatch(setGlobalLoading(false));
          return;
        }

        if (temp_recipe.instructions !== null) {
          let temp_ing = {
            id: instruction_data[0].id,
            name: instruction_data[0].description,
          };
          temp_recipe.instructions.push(temp_ing);
        }
      }

      const recipe_tags_data = await iface.get_search(
        "recipe_tags",
        temp_recipe.id.toLocaleString()
      );
      if (recipe_tags_data === undefined) {
        dispatch(setGlobalLoading(false));
        return;
      }

      let recipe_tags_response = recipe_tags_data;

      for (let i = 0; i < recipe_tags_response.length; i++) {
        const tag_data = await iface.get_search(
          "tag",
          recipe_tags_response[i].tag_id
        );
        if (tag_data === undefined) {
          dispatch(setGlobalLoading(false));
          return;
        } else {
          if (temp_recipe.tags !== null) {
            temp_recipe.tags.push(tag_data[0].name);
          }
        }
      }

      if (temp_recipe.image !== null && temp_recipe.image !== undefined) {
        if (temp_recipe.image.length !== 0) {
          let cdn_url = iface.getCdn();
          setImage(cdn_url + temp_recipe.image);
        }
      }

      setRecipe(temp_recipe);
      dispatch(setGlobalLoading(false));
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

    dispatch(setGlobalLoading(false));
  }, [recipe.user_id, id]);

  const openDeletePopUp = () => {
    dispatch(
      setPopup({
        open: true,
        isError: true,
        message: "Are you sure you want to delete this recipe?",
        title: "Delete recipe",
        leftButtonText: "Yes",
        rightButtonText: "Cancel",
        onClickLeft: PopUpFunctions.DELETE_FUNCTION,
        id: recipe.id,
        external_recipe: is_external,
      })
    );
  };

  const getIngredientMultiplier = () => {
    if (originalPortions === 0) {
      return 1;
    }
    return activePortions / originalPortions;
  };

  const getMultipliedIngredients = (quantity: number) => {
    if (quantity === 0) {
      return "";
    }
    let multiplied_num = (quantity *= getIngredientMultiplier());
    return Math.round(multiplied_num * 100) / 100;
  };

  useEffect(() => {
    if (
      recipe.description !== undefined &&
      recipe.description !== null &&
      recipe.description.length !== 0
    ) {
      setDescription(recipe.description.replace(/\\n/g, "\n"));
    }
  }, [recipe.description]);

  useEffect(() => {
    if (
      recipe.meal_type !== undefined &&
      recipe.meal_type !== null &&
      recipe.meal_type.length !== 0
    ) {
      setMealType(Capitalize(recipe.meal_type));
    }
  }, [recipe.meal_type]);

  const buttonContainerClasses = classNames("RecipeButtonsContainer", {
    DisabledButtonsContainer: tokenCookie === undefined,
  });

  return (
    <PageTemplate
      hasBackButton
      content={
        <div id="RecipePage" key={"recipe-page"}>
          <div className="RecipeContainer">
            <div className="RecipeImageContainer">
              <RecipeImage image={image} alt="Recipe" priority />
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
                  <h4 className="PortionsLabel">Category:</h4>
                  <h6 className="MealTypeText">{mealType}</h6>
                </div>
              </div>

              {!is_external && (
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
              )}

              <div className="RecipeTitleUnderLine" />
              {!is_external && (
                <div className="RecipeRow" id="RecipeDescriptionContainer">
                  <div>
                    <h4 className="RecipeSubTitle">Description:</h4>
                    <h6 className="RecipeDescription">{description}</h6>
                  </div>
                </div>
              )}
              {!is_external && (
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
              )}
              {!is_external && (
                <div className="RecipeRow" id="RecipInstructionsContainer">
                  <h4 className="RecipeSubTitle">Instructions:</h4>
                  <ol className="RecipeInstructions">
                    {recipe.instructions !== null &&
                      recipe.instructions.map((instruction) => {
                        return (
                          <li key={instruction.id}>
                            {Capitalize(instruction.name)}
                          </li>
                        );
                      })}
                  </ol>
                </div>
              )}

              {recipe.tags !== null && recipe.tags.length > 0 && (
                <div className="RecipeRow">
                  <div className="TagsContainer">
                    {recipe.tags.map((tag) => (
                      <Tag key={tag} id={0} text={tag} />
                    ))}
                  </div>
                </div>
              )}

              {!is_external && (
                <div id="RecipeInfoContainer">
                  <div className="RecipeInfo">
                    <p>Uploaded by: </p>
                    <p>{Capitalize(author)}</p>
                  </div>
                  <div
                    className="RecipeInfo"
                    style={{ justifyContent: "center" }}
                  >
                    <p>Last updated: </p>
                    <p>
                      {recipe.updated_at !== null &&
                        FormatDate(recipe.updated_at)}
                    </p>
                  </div>
                  <div
                    className="RecipeInfo"
                    style={{ justifyContent: "flex-end" }}
                  >
                    <p>Created: </p>
                    <p>
                      {recipe.created_at !== null &&
                        FormatDate(recipe.created_at)}
                    </p>
                  </div>
                </div>
              )}

              {is_external && (
                <div className="RecipeRow BottomRow" id="RecipeLinkContainer">
                  <div>
                    <h4 className="RecipeSubTitle">Link:</h4>
                    <div className="RecipeLinkRow">
                      {recipe.link && (
                        <a className="RecipeLink" href={url}>
                          {url}
                        </a>
                      )}

                      {recipe.link &&
                      recipe.link.toLowerCase().includes("instagram.com") ? (
                        <img src={InstagramIcon} alt="Instagram" />
                      ) : (
                        <img src={LinkIcon} alt="Link" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={buttonContainerClasses}>
              <div className="OneHalf">
                <CustomButton
                  onClick={() => {
                    if (tokenCookie === undefined) return;
                    if (id?.startsWith("e")) {
                      navigate("/EditExternalRecipe/" + id);
                    } else {
                      navigate("/recipe/edit/" + id);
                    }
                  }}
                  image={PenIcon}
                />
              </div>
              <div className="OneHalf">
                <CustomButton
                  onClick={() => {
                    if (tokenCookie === undefined) return;
                    openDeletePopUp();
                  }}
                  image={TrashIcon}
                  background="red"
                  color="almost-white"
                />
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Recipe;
