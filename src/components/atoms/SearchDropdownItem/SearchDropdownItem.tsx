import React, { SyntheticEvent, useEffect, useState } from "react";
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
  const [image, setImage] = useState<string>("");

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
          let cdn_url = iface.getCdn();
          setImage(cdn_url + response[0].image);
        }
      }
    });
  }, [id]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/recipe/" + recipe.id);
  };

  const addImageFallback = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = missing_picture_placeholder;
  };

  return (
    <div className="SearchDropdownItem" onClick={handleClick}>
      <div className="SearchDropdownImageContainer">
        <img src={image} onError={addImageFallback} alt="Recipe" />
      </div>
      <div className="SearchDropdownTextContainer">
        <p>{Capitalize(recipe.title)}</p>
      </div>
    </div>
  );
};

export default SearchDropdownItem;
