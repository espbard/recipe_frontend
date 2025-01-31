import React, { useEffect, useState } from "react";
import LogoutLink from "../LogoutLink/LogoutLink";
import "./NavBar.scss";
import Cookies from "js-cookie";
import classNames from "classnames";
import { useAppSelector } from "../../../redux/hooks";

interface NavBarProps {
  title: string;
  centered?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ title, centered }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenCookie = Cookies.get("token");

    setToken(tokenCookie || "");
  }, []);

  const sidebarCollapsed = useAppSelector(
    (state) => state.global.sidebarCollapsed
  );

  const NavBarClasses = classNames("NavBar", {
    NavBarCentered: centered,
    NavBarBlurred: !sidebarCollapsed,
  });

  return (
    <div className={NavBarClasses}>
      <div id="NavBar_Title_Container">
        <h4 className="NavBar_Title">{title}</h4>
      </div>
      {token && (
        <div style={{ display: "flex" }}>
          <div id="NavBar_LogoutLink">
            <LogoutLink />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
