import React from "react";
import "./ErrorPage.scss";

interface ErrorPageProps {
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  return (
    <div id="ErrorPage">
      <h1 id="ErrorPageMessage">{message}</h1>
      <button id="ErrorPageReload" onClick={() => window.location.reload()}>
        <p>⟳</p>
      </button>
    </div>
  );
};

export default ErrorPage;
