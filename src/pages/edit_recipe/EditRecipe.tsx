import React, { useEffect, useRef, useState } from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import { IngredientInput } from "../../components/molecules/IngredientInput/IngredientInput";
import { InstructionInput } from "../../components/molecules/InstructionInput/InstructionInput";
import ServerIface from "../../ServerIface";
import "./EditRecipe.scss";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { PopUp } from "../../components/molecules/PopUp/PopUp";
import { Tag } from "../../components/molecules/Tag/Tag";
import classNames from "classnames";
import { AutocompleteOption, Ingredient } from "../../common/common";
import { Icon } from "../../common/common";
import Cookies from "js-cookie";

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
  const [newRecipeId, set_newRecipeId] = useState<number>(-1);
  const [result, set_result] = useState<boolean>(false);
  const [isPostRequest, set_isPostRequest] = useState<boolean>(false);
  const [resultPopUpVisible, set_resultPopUpVisible] = useState<boolean>(false);
  const [image, set_image] = useState<File | null>(null);
  const [originalImageName, set_originalImageName] = useState<string>("");
  const [allTags, set_allTags] = useState<AutocompleteOption[]>([]);
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
  const navigate = useNavigate();

  const format_image_name = (name: string) => {
    if (name === undefined) {
      return "";
    }
    let file_name_split = name.split(".");
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
        description: respose.description,
        created_at: respose.created_at,
        updated_at: respose.updated_at,
        instructions: [],
        ingredients: [],
        user_id: respose.user_id,
        image: respose.image,
        tags: [],
        portions: respose.portions ? respose.portions : 2,
      };

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
  }, [recipe.user_id, id, originalImageName]);

  // const ref = useRef(null);

  // useEffect(() => {
  //   if (ref?.current) {
  //     if (formErrors.title_error.is_err) {
  //       ref.current.focus();
  //     }
  //   }
  // }, [ref, formErrors]);

  // const [inputRef, setInputFocus] = useFocus();

  // const useFocus = () => {
  //   const htmlElRef = useRef(null);
  //   const setFocus = () => {
  //     htmlElRef.current && htmlElRef.current.focus();
  //   };

  //   return [htmlElRef, setFocus];
  // };

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
  }, [recipe.tags, selectedTags]);

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

  const add_ingredient = () => {
    const new_ingredients = [...recipe.ingredients];
    new_ingredients.push({ name: "", quantity: 0, unit: "" });
    set_recipe({ ...recipe, ingredients: new_ingredients });
  };

  const add_instruction = () => {
    const new_instructions = [...recipe.instructions];
    new_instructions.push("");
    set_recipe({ ...recipe, instructions: new_instructions });
  };

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
      // document.getElementById("TitleError")?.focus();
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
  };

  const submitEditRecipe = () => {
    let recipe_to_post = {
      title: recipe.title,
      description: recipe.description,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
      image: originalImageName,
      tags: recipe.tags,
      portions: recipe.portions,
    };

    for (let i = 0; i < recipe_to_post.tags.length; i++) {
      recipe_to_post.tags[i] = recipe_to_post.tags[i].toLowerCase();
    }

    const serverIface = new ServerIface();

    if (recipe.image !== originalImageName) {
      if (image !== null) {
        let image_name = format_image_name(image.name);
        set_originalImageName(image_name);
        recipe_to_post.image = image_name;
        let res = serverIface.uploadImage(image!);

        res.then((res) => {
          console.log("Result: ", res);
          if (res.success) {
            recipe_to_post.image = res.message;
          }
        });
      }
    }

    if (id !== undefined) {
      recipe_to_post.image = recipe_to_post.image;
      let res = serverIface.put_recipe(recipe_to_post, id);

      res.then((res) => {
        set_isPostRequest(false);
        if (res !== undefined && res.res.success) {
          set_result(true);
          set_resultPopUpVisible(true);
        } else {
          set_result(false);
        }
      });
    }
  };

  const submitNewRecipe = () => {
    // console.log("submitNewRecipe");
    // // let id = Cookies.get("id");
    // // let recipe_to_post = {
    // //   user_id: id && id !== undefined ? parseInt(id) : -1,
    // //   title: recipe.title,
    // //   description: recipe.description,
    // //   instructions: recipe.instructions,
    // //   ingredients: recipe.ingredients,
    // //   image: "",
    // //   tags: recipe.tags,
    // //   portions: recipe.portions,
    // // };
    // // for (let i = 0; i < recipe_to_post.tags.length; i++) {
    // //   recipe_to_post.tags[i] = recipe_to_post.tags[i].toLowerCase();
    // // }
    // const serverIface = new ServerIface();
    // if (image !== null) {
    //   // recipe_to_post.image = image.name;
    //   let res = serverIface.uploadImage(image!);
    //   res.then((res) => {
    //     console.log("Result: " + res);
    //     // if (res.success) {
    //     //   recipe_to_post.image = res.message;
    //     // }
    //   });
    // }
    // // let res = serverIface.post_recipe(recipe_to_post);
    // // res.then((res) => {
    // //   set_isPostRequest(false);
    // //   if (res.success) {
    // //     set_newRecipeId(res.id);
    // //     set_result(true);
    // //     set_resultPopUpVisible(true);
    // //   } else {
    // //     set_result(false);
    // //   }
    // // });
  };

  const onCloseButtonPressed = () => {
    if (result) {
      if (id) {
        navigate("/recipe/" + id);
      } else {
        navigate("/recipe/" + newRecipeId);
      }
    }
    set_resultPopUpVisible(false);
  };

  const TagsContainerClasses = classNames("TagsContainer", {
    EditRecipeInput: true,
  });

  return (
    <PageTemplate
      content={
        <div id="EditRecipePage">
          {resultPopUpVisible && (
            <PopUp
              title={isPostRequest ? "Create recipe" : "Update recipe"}
              text={
                result
                  ? `Successfully ${
                      isPostRequest ? "created" : "updated"
                    } recipe!`
                  : `Failed to ${isPostRequest ? "create" : "update"} recipe!`
              }
              singleButton={true}
              leftButtonText="Close"
              color={result ? "green" : "red"}
              onClickLeft={() => onCloseButtonPressed()}
            />
          )}
          <h1>{id ? "Edit Recipe" : "New Recipe"}</h1>
          <div className="EditRecipeRow">
            <div
              className="EditRecipeLabel"
              // ref={(input) => {
              //   this.nameInput = input;
              // }}
            >
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
              onChange={(e) => set_recipe({ ...recipe, title: e.target.value })}
              placeholder="Name of recipe..."
              className="EditRecipeInput"
            />
          </div>
          <div className="EditRecipeRow">
            <div className="EditRecipeLabel">Image:</div>
            <div className="EditRecipeInput">
              <label htmlFor="files" className="UploadImageButton">
                {recipe.image.length > 0 ? "Change image" : "Upload image"}
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
              <div className="EditRecipeImageText">
                <h6>{recipe.image}</h6>
              </div>
            </div>
          </div>
          <div className="EditRecipeRow">
            <div className="EditRecipeLabel">Description:</div>
            <textarea
              value={recipe.description}
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
              <ol>
                {recipe.instructions.map((instruction, id) => (
                  <InstructionInput
                    key={id}
                    text={instruction}
                    id={id}
                    onChange={update_instruction}
                    remove={remove_instruction}
                    move={move_instruction}
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
                  set_recipe({ ...recipe, portions: parseInt(e.target.value) })
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
              <div className="AddButtonContainer">
                <Tag text={Icon.Add} onAdd={() => add_tag()} noSymbol />
              </div>
            </div>
          </div>
          <div className="WhiteRow">
            <div className="SaveButtonContainer">
              <CustomButton label="Save" onClick={onSaveButtonPressed} />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default EditRecipe;
