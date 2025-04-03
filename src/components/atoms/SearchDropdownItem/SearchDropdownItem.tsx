import React, { useEffect, useState } from "react";
import { Capitalize } from "../../../common/common";
import "./SearchDropdownItem.scss";
import ServerIface from "../../../ServerIface";
import missing_picture_placeholder from "../../../assets/images/missing_picture_placeholder.png";
import { useNavigate } from "react-router-dom";

interface SearchDropdownItemProps {
  id: number;
}

interface RecipeIface {
  id: number;
  title: string;
  image: string;
}

const SearchDropdownItem: React.FC<SearchDropdownItemProps> = ({ id }) => {
  const [recipe, setRecipe] = useState<RecipeIface>({
    id: 0,
    title: "",
    image: "",
  });
  const [imageBase64, setImageBase64] = useState<String>("");
  const [usePlaceholder, setUsePlaceholder] = useState<boolean>(true);

  useEffect(() => {
    const iface = new ServerIface();
    iface.get_search("recipe", id.toString()).then((response) => {
      if (response !== undefined) {
        let temp_recipe = {
          id: response[0].id,
          title: response[0].title,
          image: response[0].image,
        };
        setRecipe(temp_recipe);
        if (response[0].image !== "") {
          iface.getImage(response[0].image).then((image_response) => {
            if (image_response === undefined) {
              setUsePlaceholder(true);
            } else {
              setUsePlaceholder(false);
              setImageBase64(image_response);
            }
          });
        }
      }
    });
  }, [id]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/recipe/" + recipe.id);
  };

  return (
    <div className="SearchDropdownItem" onClick={handleClick}>
      <div className="SearchDropdownImageContainer">
        {usePlaceholder ? (
          <img src={missing_picture_placeholder} alt="Recipe" />
        ) : (
          <img src={`data:image/jpg;base64,${imageBase64}`} alt="Recipe" />
        )}
      </div>
      <div className="SearchDropdownTextContainer">
        <p>{Capitalize(recipe.title)}</p>
      </div>
    </div>
  );
};

export default SearchDropdownItem;
