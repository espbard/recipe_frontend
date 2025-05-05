import React, { useEffect, useState } from "react";
import LogoutLink from "../LogoutLink/LogoutLink";
import "./NavBar.scss";
import { TinyImage } from "../../atoms/TinyImage/TinyImage";
import logo from "../../../assets/images/recipe_icon256.png";
import Cookies from "js-cookie";
import { setSearchStr } from "../../../redux/globalSlice";
import { useAppDispatch } from "../../../redux/hooks";
import SearchDropdown from "../../molecules/SearchDropdown/SearchDropdown";
import ServerIface from "../../../ServerIface";
import { ListItem } from "../../../common/common";
import { useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const [recipeList, setRecipeList] = useState<ListItem[]>([]);
  const [currentSearchStr, setCurrentSearchStr] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentPage = window.location.pathname;
  const tokenCookie = Cookies.get("token");

  useEffect(() => {
    const iface = new ServerIface();

    let recipes: ListItem[] = [];
    iface.get("recipes").then((res) => {
      if (res !== undefined) {
        for (let i = 0; i < res.length; i++) {
          recipes.push({
            id: res[i].id,
            name: res[i].title,
          });
        }
      }

      iface.get("external_recipes").then((ext_res) => {
        if (ext_res !== undefined) {
          for (let i = 0; i < ext_res.length; i++) {
            recipes.push({
              id: 500000 + ext_res[i].id,
              name: ext_res[i].title,
            });
          }
        }
      });
    });
    setRecipeList(recipes);
  }, []);

  return (
    <div id="NavBar">
      <div id="NavBarTitleContainer">
        <div id="SidebarLogo">
          <TinyImage url={logo} alt="Logo" onClickUrl="/" />
        </div>
        <h4 className="NavBarTitle">Our Recipes ❤️</h4>
      </div>
      <div id="NavBarEnd">
        {currentPage !== "/login" && tokenCookie && (
          <div id="NavBarSearch">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setCurrentSearchStr(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch(setSearchStr(e.currentTarget.value));
                }
              }}
            />
            {currentSearchStr.length > 0 && (
              <SearchDropdown list={recipeList} search_str={currentSearchStr} />
            )}
          </div>
        )}
        {tokenCookie && (
          <div style={{ display: "flex" }}>
            <div id="NavBarLogoutLink">
              <LogoutLink />
            </div>
          </div>
        )}
        {!tokenCookie && currentPage !== "/login" && (
          <div className="NavBarLogin">
            <a onClick={() => navigate("/login")}>Log In</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
