import React, { useEffect, useState } from "react";
import "./EditExternalRecipe.scss";
import { useParams } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import classNames from "classnames";
import ServerIface from "../../ServerIface";
import { useAppDispatch } from "../../redux/hooks";
import {
  setGlobalLoading,
  setPopup,
  setRecipeList,
} from "../../redux/globalSlice";
import { PopUpFunctions } from "../../common/common";
import { IMAGE_MAX_SIZE, resizeImage } from "../../common/images";

const EditExternalRecipe: React.FC = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [meal, setMeal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [titleError, setTitleError] = useState(false);
  const [linkError, setLinkError] = useState(false);
  const [mealError, setMealError] = useState(false);

  const validateInput = () => {
    let hasError = false;
    if (title === "") {
      setTitleError(true);
      hasError = true;
    }
    if (link === "") {
      setLinkError(true);
      hasError = true;
    }
    if (meal === "") {
      setMealError(true);
      hasError = true;
    }
    return !hasError;
  };
  const dispatch = useAppDispatch();

  const format_image_name = (name: string) => {
    if (name === undefined) {
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

  const submitNewRecipe = (img_name?: string) => {
    const iface = new ServerIface();
    iface
      .post("external_recipes", {
        title: title,
        image: img_name ?? "",
        link: link,
        link_type: "placeholder",
        meal_type: meal,
      })
      .then((res) => {
        dispatch(setGlobalLoading(false));
        if (res === undefined || res.id === undefined) {
          dispatch(
            setPopup({
              open: true,
              isError: true,
              message: "Failed to add recipe",
              onClickLeft: PopUpFunctions.RELOAD,
            })
          );
        } else {
          dispatch(
            setPopup({
              open: true,
              isError: false,
              message: "Successfully added recipe",
              onClickLeft: PopUpFunctions.GO_TO_NEW_EXTERNAL_RECIPE,
              onClickRight: PopUpFunctions.CLOSE_AND_REFRESH_RECIPES,
              leftButtonText: "Go to recipe",
              id: res.id,
              external_recipe: true,
            })
          );
        }
      });
  };

  const submitUpdateRecipe = (img_name?: string) => {
    const iface = new ServerIface();
    if (id !== undefined) {
      let ext_id = id;
      if (id.startsWith("e")) {
        ext_id = id.substring(1);
      }
      iface
        .put_external_recipe(
          {
            title: title,
            image: img_name ?? imageUrl ?? "",
            link: link,
            link_type: "placeholder",
            meal_type: meal,
          },
          ext_id
        )
        .then((res) => {
          if (res === undefined || !res.res.success) {
            dispatch(
              setPopup({
                open: true,
                isError: true,
                message: "Failed to update recipe",
                onClickLeft: PopUpFunctions.RELOAD,
              })
            );
          } else {
            dispatch(
              setPopup({
                open: true,
                isError: false,
                message: "Successfully updated recipe",
                onClickLeft: PopUpFunctions.GO_BACK,
                onClickRight: PopUpFunctions.CLOSE_AND_REFRESH_RECIPES,
                leftButtonText: "Go to recipe",
                id: parseInt(ext_id),
                external_recipe: true,
              })
            );
          }
        });
    }
  };

  const onSubmitButtonPressed = () => {
    dispatch(setGlobalLoading(true));
    setTitleError(false);
    setLinkError(false);
    setMealError(false);

    const iface = new ServerIface();

    if (validateInput()) {
      // The image name is only known once the upload has finished, so the
      // recipe is submitted from that callback. Submitting here as well used to
      // create a second recipe, without an image, alongside the real one.
      if (image !== null) {
        let img_cpy = new File([image], format_image_name(image.name), {
          type: image.type,
        });

        resizeImage(img_cpy, IMAGE_MAX_SIZE).then((new_img) => {
          setImage(new_img);
          iface.uploadImage(new_img).then((res) => {
            // A failed upload reports its own error, and leaves the recipe to
            // be submitted again rather than storing the failure message as the
            // image name.
            if (res !== undefined && res.success && res.message !== undefined) {
              if (id !== undefined) {
                submitUpdateRecipe(res.message);
              } else {
                submitNewRecipe(res.message);
              }
            }
          });
        });
      } else if (id !== undefined) {
        submitUpdateRecipe();
      } else {
        submitNewRecipe();
      }
    }
    dispatch(setGlobalLoading(false));
  };

  useEffect(() => {
    const iface = new ServerIface();

    if (id !== undefined) {
      iface.get("external_recipes/" + id).then((res) => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].id !== undefined) {
            if (res[i].id.toString() === id.substring(1)) {
              setTitle(res[i].title);
              setLink(res[i].link);
              setMeal(res[i].meal_type);
              setImageUrl(res[i].image);
            }
          }
        }
      });
    }
  }, []);

  const titleClasses = classNames("EditExternalRecipeRowInput", {
    InputHasError: titleError,
  });

  const linkClasses = classNames("EditExternalRecipeRowInput", {
    InputHasError: linkError,
  });

  const mealClasses = classNames("EditExternalRecipeRowInput", {
    InputHasError: mealError,
  });

  return (
    <PageTemplate
      hasBackButton={true}
      content={
        <div id="EditExternalRecipe">
          {id ? (
            <h1 id="EditExternalRecipeTitle">Edit External Recipe</h1>
          ) : (
            <h1 id="EditExternalRecipeTitle">Add External Recipe</h1>
          )}
          <div id="EditExternalRecipeForm">
            <div className="EditExternalRecipeRow">
              <h3 className="EditExternalRecipeRowTitle">Title: </h3>
              <input
                className={titleClasses}
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) {
                    setTitleError(false);
                  }
                }}
              />
            </div>
            <div className="EditExternalRecipeRow">
              <h3 className="EditExternalRecipeRowTitle">Link: </h3>
              <input
                className={linkClasses}
                type="text"
                placeholder="External Recipe URL"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                  if (linkError) {
                    setLinkError(false);
                  }
                }}
              />
            </div>
            <div className="EditExternalRecipeRow">
              <h3 className="EditExternalRecipeRowTitle">Meal: </h3>
              <select
                className={mealClasses}
                value={meal}
                onChange={(e) => {
                  setMeal(e.target.value);
                  if (mealError) {
                    setMealError(false);
                  }
                }}
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

            <div className="EditExternalRecipeRow">
              <h3 className="EditExternalRecipeRowTitle">Image: </h3>
              <div className="EditExternalRecipeImageContent">
                <div className="EditExternalRecipeImageText">
                  <h6>
                    {image ? image.name : imageUrl ? imageUrl : "Select image"}
                  </h6>
                </div>
                <label
                  htmlFor="files"
                  className="EditExternalRecipeUploadImageButton"
                >
                  {image ? "Change" : "Upload"}
                </label>
                <input
                  id="files"
                  className="EditExternalRecipeUploadImageInput"
                  style={{ display: "none" }}
                  accept="image/png, image/jpeg"
                  type="file"
                  onChange={(e) => {
                    setImage(e.target.files![0]);
                  }}
                />
              </div>
            </div>
          </div>
          <div id="EditExternalRecipeSubmit" onClick={onSubmitButtonPressed}>
            Submit
          </div>
        </div>
      }
    />
  );
};

export default EditExternalRecipe;

// https://www.instagram.com/reel/C_dTY5bocGt/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==
