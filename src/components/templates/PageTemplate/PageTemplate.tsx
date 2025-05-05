import React, { JSX, useEffect } from "react";
import NavBar from "../../organisms/NavBar/NavBar";
import ServerIface from "../../../ServerIface";
import ErrorPage from "../../../pages/error_page/ErrorPage";
import "./PageTemplate.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setServerConnection } from "../../../redux/globalSlice";
import PopUp from "../../molecules/PopUp/PopUp";
import { CustomButton } from "../../atoms/CustomButton/CustomButton";
import { Icon } from "../../../common/common";
import { useNavigate } from "react-router-dom";
interface PageTemplateProps {
  content: JSX.Element | undefined;
  hasBackButton?: boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  content,
  hasBackButton,
}) => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const popup = useAppSelector((state) => state.global.popup);
  const [serverConnected, setServerConnected] = React.useState(true);
  const dispatch = useAppDispatch();

  const server_connection = useAppSelector(
    (state) => state.global.server_connection
  );

  const loading = useAppSelector((state) => state.global.loading);
  const globalLoading = useAppSelector((state) => state.global.loadingGlobal);

  useEffect(() => {
    if (popup.open) {
      setPopupOpen(true);
    } else {
      setPopupOpen(false);
    }
  }, [popup.open]);

  useEffect(() => {
    function connectToServer() {
      let iface = new ServerIface();
      iface.connect().then((res) => {
        if (res !== undefined) {
          setServerConnected(true);
          dispatch(setServerConnection(true));
        } else {
          setServerConnected(false);
        }
      });
    }
    if (server_connection) {
      if (!serverConnected) {
        setServerConnected(true);
      }
    } else {
      connectToServer();
    }
  }, []);

  const navigate = useNavigate();

  const getContent = () => {
    return (
      <div id="PageTemplate">
        {(globalLoading || loading) && (
          <div id="LoadingPopUp">
            <div className="LoadIcon"></div>
          </div>
        )}
        {!serverConnected && !loading && !globalLoading ? (
          <ErrorPage
            key="error-page"
            message={"Failed to connect to the server"}
          />
        ) : (
          <div id="PageContent">
            <NavBar />
            {hasBackButton && (
              <div className="BackButtonContainer">
                <CustomButton
                  label={Icon.Back}
                  onClick={() => navigate(-1)}
                  background="black"
                  size="medium"
                  inverted
                  round
                  unBordered
                />
              </div>
            )}
            {popupOpen && (
              <PopUp
                key={popup.message}
                title={
                  popup.title
                    ? popup.title
                    : popup.isError
                    ? "Error"
                    : "Success"
                }
                isError={popup.isError}
                text={popup.message}
                leftButtonText={
                  popup.leftButtonText
                    ? popup.leftButtonText
                    : popup.isError
                    ? "Reload"
                    : "Ok"
                }
                rightButtonText={
                  popup.rightButtonText ? popup.rightButtonText : "Close"
                }
                singleButton={popup.singleButton}
              />
            )}
            <div id="MainContent">{content}</div>
          </div>
        )}
      </div>
    );
  };
  try {
    return getContent();
  } catch (error) {
    console.error(error);
    return <></>;
  }
};

export default PageTemplate;
