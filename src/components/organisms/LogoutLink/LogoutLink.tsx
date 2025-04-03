import React, { useEffect } from "react";
import UserIcon from "../../atoms/UserIcon/UserIcon";
import "./LogoutLink.scss";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import FocusedPopUp from "../../molecules/FocusedPopUp/FocusedPopUp";
import { useAuth } from "../../../context/AuthContext";
import Cookies from "js-cookie";
import { Capitalize } from "../../../common/common";

const LogoutLink: React.FC = () => {
  const [userInfoVisible, setUserInfoVisible] = React.useState(false);
  const [displayName, setDisplayName] = React.useState("");
  const navigate = useNavigate();

  const handleIconPressed = () => {
    setUserInfoVisible(true);
  };
  const closeUserInfo = () => {
    setUserInfoVisible(false);
  };

  const userInfoClasses = classNames("UserInfo", {
    UserInfoActive: userInfoVisible,
  });

  useEffect(() => {
    const dpCookie = Cookies.get("display-name");
    if (!dpCookie || dpCookie.length <= 1) {
      setDisplayName("");
    } else {
      setDisplayName(Capitalize(dpCookie));
    }
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="LogoutLink">
      <UserIcon callBack={handleIconPressed} />
      <FocusedPopUp
        onClickOutside={() => closeUserInfo()}
        hidden={!userInfoVisible}
      >
        {
          <div className={userInfoClasses}>
            <UserIcon />

            <p className="UserInfoUserName">{displayName}</p>
            <div className="LogoutButton" onClick={handleLogout}>
              Sign Out
            </div>
          </div>
        }
      </FocusedPopUp>
    </div>
  );
};

export default LogoutLink;
