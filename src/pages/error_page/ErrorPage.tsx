import React from "react";
import "./ErrorPage.scss";
import { Icon } from "../../common/common";
import { useNavigate } from "react-router-dom";

interface ErrorPageProps {
  message: string;
  returnToHome?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message, returnToHome }) => {
  const navigate = useNavigate();
  return (
    <div id="ErrorPage">
      <h1 id="ErrorPageMessage">{message}</h1>
      {returnToHome ? (
        <button
          className="ErrorPageIcon ErrorPageHome"
          onClick={() => navigate("/")}
        >
          <p>{Icon.Home}</p>
        </button>
      ) : (
        <button
          className="ErrorPageIcon ErrorPageReload"
          onClick={() => window.location.reload()}
        >
          <p>⟳</p>
        </button>
      )}
    </div>
  );
};

export default ErrorPage;
