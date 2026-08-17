import React, { useEffect, useState } from "react";
import { Capitalize } from "../../../common/common";
import "./SearchDropdownItem.scss";
import ServerIface from "../../../ServerIface";
import RecipeImage from "../RecipeImage/RecipeImage";
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

    if (id > 500000) {
      const ext_id = id - 500000;

      iface
        .get_search("external_recipe", ext_id.toString())
        .then((response) => {
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
    } else {
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
    }
  }, [id]);

  const navigate = useNavigate();

  const handleClick = () => {
    if (id > 500000) {
      navigate("/recipe/e" + (id - 500000));
    } else {
      navigate("/recipe/" + recipe.id);
    }
    window.location.reload();
  };

  return (
    <div className="SearchDropdownItem" onClick={handleClick}>
      <div className="SearchDropdownImageContainer">
        <RecipeImage image={image} alt="Recipe" />
      </div>
      <div className="SearchDropdownTextContainer">
        <p>{Capitalize(recipe.title)}</p>
      </div>
    </div>
  );
};

export default SearchDropdownItem;
