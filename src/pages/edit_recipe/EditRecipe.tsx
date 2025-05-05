import React, { useEffect, useState } from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import { IngredientInput } from "../../components/molecules/IngredientInput/IngredientInput";
import { InstructionInput } from "../../components/molecules/InstructionInput/InstructionInput";
import ServerIface from "../../ServerIface";
import "./EditRecipe.scss";
import { useNavigate, useParams } from "react-router-dom";
import { Tag } from "../../components/molecules/Tag/Tag";
import classNames from "classnames";
import {
  AutocompleteOption,
  Ingredient,
  PopUpFunctions,
} from "../../common/common";
import { Icon } from "../../common/common";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setGlobalLoading, setPopup } from "../../redux/globalSlice";
import Resizer from "react-image-file-resizer";

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
  meal_type: string;
}

interface FormError {
  is_err: boolean;
  message: string;
}

interface FormErrorsIface {
  title_error: FormError;
  image_error: FormError;
  description_error: FormError;
  ingredients_error: FormError;
  instructions_error: FormError;
  serves_error: FormError;
  tags_error: FormError;
}

const EditRecipe: React.FC = () => {
  const [result, set_result] = useState<boolean>(true);
  const [image, set_image] = useState<File | null>(null);
  const [originalImageName, set_originalImageName] = useState<string>("");
  const [allTags, set_allTags] = useState<AutocompleteOption[]>([]);
  const [moveToNextIngredient, setMoveToNextIngredient] = useState(false);
  const [moveToNextInstruction, setMoveToNextInstruction] = useState(false);
  const [selectedTags, set_selectedTags] = useState<AutocompleteOption[]>([]);
  const [recipe, set_recipe] = useState<RecipeIface>({
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
    portions: 2,
    meal_type: "",
  });

  const [formErrors, set_formErrors] = useState<FormErrorsIface>({
    title_error: { is_err: false, message: "" },
    image_error: { is_err: false, message: "" },
    description_error: { is_err: false, message: "" },
    ingredients_error: { is_err: false, message: "" },
    instructions_error: { is_err: false, message: "" },
    serves_error: { is_err: false, message: "" },
    tags_error: { is_err: false, message: "" },
  });

  const { id } = useParams();

  const format_image_name = (name: string) => {
    if (name === undefined || name === null || name === "") {
      return "";
    }
    let file_name_split = name.split(".");
    if (file_name_split.length < 2) {
      return "";
    }
    let file_name = "";
    let extension = file_name_split[file_name_split.length - 1];

    for (let i = 0; i < file_name_split.length - 1; i++) {
      file_name += file_name_split[i];
    }

    file_name = file_name.replaceAll(" ", "_");
    file_name = file_name.replaceAll(":", "_");
    file_name = file_name.replaceAll("/", "_");
    file_name = file_name.replaceAll(".", "_");
    file_name = file_name.replaceAll(",", "_");

    return file_name + "." + extension;
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      dispatch(setGlobalLoading(true));
      const iface = new ServerIface();
      const search_id = id ? id.toLocaleString() : "-1";
      const recipe_data = await iface.get_search("recipe", search_id);

      if (recipe_data === undefined) {
        return;
      }

      let respose = recipe_data[0];
      let recipe: RecipeIface = {
        id: respose.id,
        title: respose.title,
        description:
          respose.description && respose.description.replace(/\\n/g, "\n"),
        created_at: respose.created_at,
        updated_at: respose.updated_at,
        instructions: [],
        ingredients: [],
        user_id: respose.user_id,
        image: respose.image,
        tags: [],
        portions: respose.portions ? respose.portions : 2,
        meal_type: respose.meal_type,
      };

      set_image(respose.image);

      if (originalImageName === "") {
        set_originalImageName(recipe.image);
      }

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

        if (ingredient_data === undefined || ingredient_data[0] === undefined) {
          continue;
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
      set_selectedTags([]);
      let recipe_tags: AutocompleteOption[] = [];

      for (let i = 0; i < recipe_tags_response.length; i++) {
        const tag_data = await iface.get_search(
          "tag",
          recipe_tags_response[i].tag_id
        );
        if (tag_data === undefined) {
          return;
        }
        recipe.tags.push(tag_data[0].name);
        recipe_tags.push({
          label: tag_data[0].name,
          id: recipe_tags_response[i].tag_id,
        });
      }

      set_recipe(recipe);
      set_selectedTags(recipe_tags);
    };
    if (id !== undefined) {
      fetchRecipe();
    }
    let recipe_cpy = { ...recipe, image: format_image_name(recipe.image) };
    set_recipe(recipe_cpy);
  }, [recipe.id, id, originalImageName]);

  useEffect(() => {
    const fetchTags = async () => {
      const iface = new ServerIface();
      const data = await iface.get_search(
        "recipe_tags",
        recipe.id.toLocaleString()
      );

      let temp_tags: AutocompleteOption[] = [];

      if (data !== undefined) {
        for (let i = 0; i < data.length; i++) {
          let option: AutocompleteOption = {
            label: data[i].name,
            id: data[i].id,
          };

          var tag_exists = false;
          for (let j = 0; j < selectedTags.length; j++) {
            if (selectedTags[j].label === option.label) {
              tag_exists = true;
            }
          }

          if (!tag_exists) {
            temp_tags.push(option);
          }
        }
        set_allTags(temp_tags);
      }
    };

    fetchTags();
  }, [recipe.tags, recipe.id, selectedTags]);

  useEffect(() => {
    dispatch(setGlobalLoading(false));
  }, [recipe.title]);

  const update_ingredient_quantity = (index: number, quantity: number) => {
    const new_ingredients = [...recipe.ingredients];
    new_ingredients[index].quantity = quantity;
    set_recipe({ ...recipe, ingredients: new_ingredients });
  };
  const update_ingredient_unit = (index: number, unit: string) => {
    const new_ingredients = [...recipe.ingredients];
    new_ingredients[index].unit = unit;
    set_recipe({ ...recipe, ingredients: new_ingredients });
  };
  const update_ingredient_name = (index: number, name: string) => {
    const new_ingredients = [...recipe.ingredients];
    new_ingredients[index].name = name;
    set_recipe({ ...recipe, ingredients: new_ingredients });
  };

  const update_instruction = (index: number, instruction: string) => {
    const new_instructions = [...recipe.instructions];
    new_instructions[index] = instruction;
    set_recipe({ ...recipe, instructions: new_instructions });
  };

  const add_ingredient = (moveToNextIngredient?: boolean) => {
    if (
      recipe.ingredients[recipe.ingredients.length - 1] !== undefined &&
      recipe.ingredients[recipe.ingredients.length - 1].name === ""
    ) {
      return;
    }
    const new_ingredients = [...recipe.ingredients];
    new_ingredients.push({ name: "", quantity: 0, unit: "" });
    set_recipe({ ...recipe, ingredients: new_ingredients });

    if (moveToNextIngredient) {
      setMoveToNextIngredient(true);
    }
  };

  const add_instruction = (moveToNextInstruction?: boolean) => {
    if (
      recipe.instructions !== undefined &&
      recipe.instructions[recipe.instructions.length - 1] === ""
    ) {
      return;
    }
    const new_instructions = [...recipe.instructions];
    new_instructions.push("");
    set_recipe({ ...recipe, instructions: new_instructions });

    if (moveToNextInstruction) {
      setMoveToNextInstruction(true);
    }
  };

  useEffect(() => {
    if (moveToNextIngredient) {
      setTimeout(() => {
        const newIngredientInput = document.querySelectorAll<HTMLInputElement>(
          ".RecipeIngredientRow input"
        )[recipe.ingredients.length * 3 - 3]; // Assuming 3 inputs per ingredient row
        newIngredientInput?.focus();
      }, 0);
    }
    setMoveToNextIngredient(false);
  }, [recipe.ingredients, moveToNextIngredient]);

  useEffect(() => {
    if (moveToNextInstruction) {
      setTimeout(() => {
        const newInstructionInput = document.querySelectorAll<HTMLInputElement>(
          ".RecipeInstructionRow input"
        )[recipe.instructions.length - 1];
        newInstructionInput?.focus();
      }, 0);
    }
    setMoveToNextInstruction(false);
  }, [recipe.instructions, moveToNextInstruction]);

  const remove_ingredient = (index: number) => {
    const new_ingredients = [...recipe.ingredients];
    new_ingredients.splice(index, 1);
    set_recipe({ ...recipe, ingredients: new_ingredients });
  };

  const remove_instruction = (index: number) => {
    const new_instructions = [...recipe.instructions];
    new_instructions.splice(index, 1);
    set_recipe({ ...recipe, instructions: new_instructions });
  };

  const add_tag = () => {
    const new_tags = [...recipe.tags];
    new_tags.push("");
    set_recipe({ ...recipe, tags: new_tags });
  };

  const remove_tag = (index: number) => {
    const new_tags = [...recipe.tags];
    new_tags.splice(index, 1);

    selectedTags.forEach((tag) => {
      if (tag.id === index) {
        set_selectedTags(selectedTags.filter((item) => item.id !== index));
      }
    });

    set_recipe({ ...recipe, tags: new_tags });
  };

  const save_tag = (index: number, tag: string) => {
    const new_tags = [...recipe.tags];
    new_tags[index] = tag;
    set_selectedTags([...selectedTags, { label: tag, id: index }]);
    set_recipe({ ...recipe, tags: new_tags });
  };

  const move_instruction = (index: number, direction_up: boolean) => {
    let new_index = index;
    if (direction_up) {
      if (index <= 0) {
        return;
      } else {
        new_index = index - 1;
      }
    }

    if (!direction_up) {
      if (index >= recipe.instructions.length - 1) {
        return;
      } else {
        new_index = index + 1;
      }
    }

    const new_instructions = [...recipe.instructions];
    const temp = new_instructions[index];

    new_instructions[index] = new_instructions[new_index];
    new_instructions[new_index] = temp;

    set_recipe({ ...recipe, instructions: new_instructions });
  };

  const validateInput = () => {
    let valid_input = true;

    if (recipe.title.length === 0) {
      let title_error: FormError = {
        is_err: true,
        message: "Title cannot be empty",
      };
      set_formErrors({ ...formErrors, title_error });
      valid_input = false;
    }

    return valid_input;
  };

  const onSaveButtonPressed = () => {
    if (!validateInput()) {
      return;
    }

    if (id) {
      submitEditRecipe();
    } else {
      submitNewRecipe();
    }
    dispatch(setGlobalLoading(false));
  };

  const dispatch = useDispatch();

  const getFormattedIngredients = () => {
    const formatted_ingredients: Ingredient[] = recipe.ingredients.map(
      (ingredient) => {
        return {
          name: ingredient.name.toLocaleLowerCase(),
          quantity: ingredient.quantity,
          unit: ingredient.unit ? ingredient.unit.toLocaleLowerCase() : "",
        };
      }
    );

    return formatted_ingredients;
  };

  const getFormattedTags = () => {
    const formatted_tags: string[] = recipe.tags.map((tag) => {
      return tag.toLocaleLowerCase();
    });

    return formatted_tags;
  };

  const openPopUp = (newId?: number) => {
    let recipe_id = id ? parseInt(id) : newId ? newId : -1;

    const message = result
      ? `Successfully ${id ? "updated" : "created"} recipe!`
      : `Failed to ${id ? "update" : "create"} recipe!`;
    dispatch(
      setPopup({
        open: true,
        isError: !result,
        message: message,
        singleButton: result,
        title: !result ? "Error" : id ? "Recipe updated" : "Recipe created",
        leftButtonText: result ? "Go to recipe" : "Reload",
        rightButtonText: result ? "" : "Cancel",
        onClickLeft: result
          ? PopUpFunctions.GO_TO_NEW_RECIPE
          : PopUpFunctions.RELOAD,
        onClickRight: result
          ? PopUpFunctions.CLOSE_AND_REFRESH_RECIPES
          : PopUpFunctions.HOME,
        id: recipe_id,
      })
    );
  };

  const submitEditRecipe = () => {
    let recipe_to_post = {
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      ingredients: getFormattedIngredients(),
      image: originalImageName,
      tags: getFormattedTags(),
      portions: recipe.portions,
      meal_type: recipe.meal_type,
    };

    const serverIface = new ServerIface();

    if (recipe.image !== originalImageName) {
      if (image !== null) {
        let image_name = format_image_name(image.name);
        set_originalImageName(image_name);
        recipe_to_post.image = image_name;

        let image_cpy = new File([image], image_name, { type: image.type });
        resizeImage(image_cpy, IMAGE_MAX_SIZE).then((new_img) => {
          set_image(new_img);
          let res = serverIface.uploadImage(new_img);

          res.then((res) => {
            if (res.success) {
              recipe_to_post.image = res.message;

              if (id !== undefined) {
                let final_res = serverIface.put_recipe(recipe_to_post, id);

                final_res.then((final_res) => {
                  if (final_res !== undefined && final_res.res.success) {
                    set_result(true);
                    openPopUp();
                  } else {
                    set_result(false);
                  }
                });
              }
            }
          });
        });
      }
    } else {
      if (id !== undefined) {
        let res = serverIface.put_recipe(recipe_to_post, id);

        res.then((res) => {
          if (res !== undefined && res.res.success) {
            set_result(true);
            openPopUp();
          } else {
            set_result(false);
          }
        });
      }
    }
  };

  const submitNewRecipe = async () => {
    let id = Cookies.get("id");
    let recipe_to_post = {
      user_id: id && id !== undefined ? parseInt(id) : -1,
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      ingredients: getFormattedIngredients(),
      image: "",
      tags: getFormattedTags(),
      portions: recipe.portions,
      meal_type: recipe.meal_type,
    };

    const serverIface = new ServerIface();
    if (image !== null) {
      let img_cpy = new File([image], format_image_name(image.name), {
        type: image.type,
      });
      set_image(img_cpy);

      let image_cpy = new File([image], image.name, { type: image.type });
      resizeImage(image_cpy, IMAGE_MAX_SIZE).then((new_img) => {
        set_image(new_img);
        let res = serverIface.uploadImage(new_img);

        res.then((res) => {
          if (res.success) {
            recipe_to_post.image = res.message;

            if (id !== undefined) {
              let final_res = serverIface.post_recipe(recipe_to_post);

              final_res.then((final_res) => {
                if (final_res !== undefined && final_res.id >= 0) {
                  set_result(true);
                  openPopUp(final_res.id);
                } else {
                  set_result(false);
                }
              });
            }
          }
        });
      });
    } else {
      let res = serverIface.post_recipe(recipe_to_post);

      res.then((result) => {
        if (result !== undefined && result.id > 0) {
          set_result(true);
          openPopUp(result.id);
        } else {
          set_result(false);
        }
      });
    }
  };

  const TagsContainerClasses = classNames("TagsContainer", {
    EditRecipeInput: true,
  });

  const IMAGE_MAX_SIZE = 1200;

  const resizeImage = (image: File, maxSize: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        image,
        maxSize,
        maxSize,
        image.type.split("/")[1],
        100,
        0,
        (uri) => {
          if (uri instanceof File) {
            resolve(uri);
          } else {
            reject(new Error("Failed to resize image"));
          }
        },
        "file"
      );
    });
  };

  const navigate = useNavigate();

  const onExternalLinkClick = () => {
    navigate("/NewExternalRecipe");
  };

  return (
    <PageTemplate
      hasBackButton
      content={
        <div id="EditRecipePage" key={"EditRecipe"}>
          <div id="EditRecipeHeader">
            <h1>{id ? "Edit Recipe" : "New Recipe"}</h1>
          </div>
          <div id="EditRecipeForm">
            {id === undefined && (
              <div className="EditRecipeRow ExternalLink">
                <p onClick={onExternalLinkClick}>Add external recipe</p>
              </div>
            )}
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">
                <p className="EditRecipeLabelText">
                  Title:
                  {formErrors.title_error.is_err && (
                    <p className="ErrorText" id="TitleError">
                      Please provide title
                    </p>
                  )}
                </p>
              </div>
              <input
                value={recipe.title}
                onChange={(e) => {
                  if (formErrors.title_error.is_err) {
                    let title_error: FormError = {
                      is_err: false,
                      message: "",
                    };
                    set_formErrors({ ...formErrors, title_error });
                  }
                  set_recipe({ ...recipe, title: e.target.value });
                }}
                placeholder="Name of recipe..."
                className="EditRecipeInput"
              />
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Image:</div>
              <div className="EditRecipeInput">
                <div className="EditRecipeImage">
                  <div className="EditRecipeImageText">
                    <h6>{recipe.image}</h6>
                  </div>
                  <label htmlFor="files" className="UploadImageButton">
                    {recipe.image && recipe.image.length > 0
                      ? "Change image"
                      : "Upload image"}
                  </label>
                  <input
                    id="files"
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg"
                    type="file"
                    onChange={(e) => {
                      set_image(e.target.files![0]);
                      set_recipe({
                        ...recipe,
                        image: format_image_name(e.target.files![0].name),
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Type:</div>
              <div className="EditRecipeInput">
                <select
                  className="EditRecipeDropDown"
                  value={recipe.meal_type}
                  onChange={(e) =>
                    set_recipe({ ...recipe, meal_type: e.target.value })
                  }
                >
                  <option value="None">None</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Soup">Soup</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Baked">Baked</option>
                  <option value="Snack">Snack</option>
                  <option value="Side">Side</option>
                </select>
              </div>
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Description:</div>
              <textarea
                value={recipe.description ?? ""}
                onChange={(e) =>
                  set_recipe({ ...recipe, description: e.target.value })
                }
                placeholder="Description..."
                className="EditRecipeInput"
              />
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Ingredients:</div>
              <div className="EditRecipeInput">
                <div className="RecipeIngredientRow">
                  {recipe.ingredients.map((ingredient, id) => (
                    <IngredientInput
                      key={id}
                      name={ingredient.name}
                      quantity={ingredient.quantity}
                      unit={ingredient.unit}
                      id={id}
                      onChangeQuantity={update_ingredient_quantity}
                      onChangeUnit={update_ingredient_unit}
                      onChangeName={update_ingredient_name}
                      remove={remove_ingredient}
                      onEnter={() => add_ingredient(true)}
                    />
                  ))}
                  <div className="AddButtonContainer">
                    <CustomButton
                      label={Icon.Add}
                      onClick={() => add_ingredient()}
                      color="white"
                      inverted
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Instructions:</div>
              <div className="EditRecipeInput">
                <ol className="RecipeInstructionRow">
                  {recipe.instructions.map((instruction, id) => (
                    <InstructionInput
                      key={id}
                      text={instruction}
                      id={id}
                      onChange={update_instruction}
                      remove={remove_instruction}
                      move={move_instruction}
                      onEnter={() => add_instruction(true)}
                    />
                  ))}
                  <div className="AddButtonContainer">
                    <CustomButton
                      label={Icon.Add}
                      onClick={() => add_instruction()}
                      color="white"
                      inverted
                    />
                  </div>
                </ol>
              </div>
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Serves:</div>
              <div className="EditRecipePortionsInputContainer">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={recipe.portions}
                  onChange={(e) =>
                    set_recipe({
                      ...recipe,
                      portions: parseInt(e.target.value),
                    })
                  }
                  placeholder="Name of recipe..."
                  className="EditRecipePortionsInput"
                />
                <CustomButton
                  label={Icon.ChevronUp}
                  onClick={() =>
                    recipe.portions < 99 &&
                    set_recipe({ ...recipe, portions: recipe.portions + 1 })
                  }
                />
                <CustomButton
                  label={Icon.ChevronDown}
                  onClick={() =>
                    recipe.portions > 1 &&
                    set_recipe({ ...recipe, portions: recipe.portions - 1 })
                  }
                />
              </div>
            </div>
            <div className="EditRecipeRow">
              <div className="EditRecipeLabel">Tags:</div>
              <div className={TagsContainerClasses}>
                {recipe.tags.map((tag, id) => {
                  return (
                    <Tag
                      key={id}
                      id={id}
                      text={tag}
                      editable
                      onDelete={() => remove_tag(id)}
                      onSave={save_tag}
                      allTags={allTags}
                    />
                  );
                })}
                <Tag text={Icon.Add} onAdd={() => add_tag()} noSymbol />
              </div>
            </div>
          </div>
          <div className="SaveButtonContainer">
            <CustomButton label="Save" onClick={onSaveButtonPressed} />
          </div>
        </div>
      }
    />
  );
};

export default EditRecipe;
