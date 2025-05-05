import { useNavigate, useParams } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import { Icon, PopUpFunctions } from "../../common/common";
import missing_picture_placeholder from "../../assets/images/missing_picture_placeholder.png";
import "./DatePage.scss";
import ServerIface from "../../ServerIface";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setGlobalLoading, setPopup } from "../../redux/globalSlice";
import SelectRecipeBox from "../../components/organisms/SelectRecipeBox/SelectRecipeBox";

interface RecipeIface {
  id: number;
  title: string;
  image: string;
}

const DatePage: React.FC = () => {
  const { day, month, year } = useParams();
  const [recipe, setRecipe] = React.useState<RecipeIface>({
    id: -1,
    title: "",
    image: "",
  });
  const [showRecipeList, setShowRecipeList] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getRecipe = () => {
      const iface = new ServerIface();
      let new_id = -1;

      iface.get_search("date", `${year}-${month}-${day}`).then((res) => {
        if (res.length > 0) {
          let rec_id = res[0].recipe_id;

          if (rec_id !== undefined) {
            iface.get_search("recipe", rec_id).then((rec_res) => {
              if (rec_res.length > 0) {
                let image = missing_picture_placeholder;

                if (rec_res[0].image !== "") {
                  let cdn_url = iface.getCdn();
                  image = cdn_url + rec_res[0].image;
                }

                new_id = rec_res[0].id;
                setRecipe({
                  id: rec_res[0].id,
                  title: rec_res[0].title,
                  image: image,
                });
              }
            });
          }
        }
      });
      if (new_id !== -1) {
        setGlobalLoading(false);
      }
    };

    getRecipe();
  });

  useEffect(() => {
    dispatch(setGlobalLoading(true));
  }, []);

  useEffect(() => {
    dispatch(setGlobalLoading(false));
  }, [recipe.id]);

  const onRecipePressed = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const onAddButtonPressed = () => {
    setShowRecipeList(true);
    // addRecipe();
  };

  const addRecipe = (recipe_id: number) => {
    const iface = new ServerIface();

    const id = 1;
    const date = `${year}-${month}-${day ? parseInt(day) : -1}`;

    iface.post("dates", { id, date, recipe_id }).then((res) => {
      if (res.id <= 0) {
        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Failed to add recipe to date",
          })
        );
      } else {
        window.location.reload();
      }
    });
  };

  const onDeleteButtonPressed = () => {
    const iface = new ServerIface();
    const date = `${year}-${month}-${day ? parseInt(day) : -1}`;

    iface.get_search("date", date).then((res) => {
      if (res.length > 0) {
        const delete_url = "dates/" + res[0].id;
        iface.delete(delete_url).then((res) => {
          if (res !== undefined && res === 200) {
            dispatch(
              setPopup({
                open: true,
                isError: false,
                message: "Recipe removed from date",
                onClickLeft: PopUpFunctions.RELOAD,
              })
            );
          } else {
            dispatch(
              setPopup({
                open: true,
                isError: true,
                message: "Failed to remove recipe from date",
                onClickLeft: PopUpFunctions.RELOAD,
              })
            );
          }
        });
      } else {
        dispatch(
          setPopup({
            open: true,
            isError: true,
            message: "Failed to remove recipe from date",
            onClickLeft: PopUpFunctions.RELOAD,
          })
        );
      }
    });
  };

  const getMonthName = (monthNumber: string | undefined) => {
    if (!monthNumber) return "";

    const date = new Date(0, parseInt(monthNumber) - 1);
    return date.toLocaleString("en-US", { month: "long" });
  };

  const onOutsideRecipeBoxPressed = () => {
    setShowRecipeList(false);
  };

  return (
    <PageTemplate
      hasBackButton
      content={
        <div id="DatePage" key={"DatePage"}>
          <div id="DatePageContainer">
            {showRecipeList && (
              <SelectRecipeBox
                selectRecipe={addRecipe}
                setInvisible={onOutsideRecipeBoxPressed}
              />
            )}
            <h1 className="DatePageTitle">
              {getMonthName(month)} {day} {year}
            </h1>
            {recipe.id > 0 ? (
              <div className="DatePageRecipe" onClick={onRecipePressed}>
                <img src={recipe.image} alt={recipe.title} />
                <h1>{recipe.title}</h1>
              </div>
            ) : (
              <h3 className="DatePageText">
                No recipe has been added to this day.
              </h3>
            )}
            <div className="DatePageButtonRow">
              <div className="DatePageButton">
                <CustomButton
                  label={
                    recipe.id > 0 ? "Change recipe" : "Add recipe to this day"
                  }
                  onClick={onAddButtonPressed}
                  background="green"
                  size="small"
                />
              </div>
              {recipe.id > 0 && (
                <div className="DatePageButton">
                  <CustomButton
                    label="Remove recipe"
                    onClick={onDeleteButtonPressed}
                    background="red"
                    size="small"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
};

export default DatePage;
