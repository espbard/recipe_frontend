import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import "./UserIcon.scss";
import Cookies from "js-cookie";

interface UserIconProps {
  callBack?: () => void;
}

const UserIcon: React.FC<UserIconProps> = ({ callBack }) => {
  const [displayName, setDisplayName] = React.useState("");
  function useClickHandler(ref: any, callBack?: () => void) {
    useEffect(() => {
      function handleClick(event: any) {
        if (callBack !== undefined) {
          if (ref.current && ref.current.contains(event.target)) {
            callBack();
          }
        }
      }

      document.addEventListener("mousedown", handleClick);

      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }, [ref, callBack]);
  }

  useEffect(() => {
    const dpCookie = Cookies.get("display-name");
    if (!dpCookie || dpCookie.length <= 1) {
      setDisplayName("");
    } else {
      setDisplayName(dpCookie);
    }
  }, []);

  const wrapperRef = useRef(null);
  useClickHandler(wrapperRef, callBack);
  const userIconClasses = classNames("UserIcon", {
    UserIconButton: callBack !== undefined,
  });

  const getInitial = () => {
    return displayName ? displayName.charAt(0).toUpperCase() : "-";
  };

  return (
    <div ref={wrapperRef} className={userIconClasses}>
      <p className="UserInitial">{getInitial()}</p>
    </div>
  );
};

export default UserIcon;
