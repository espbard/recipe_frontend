import React, { JSX, useEffect } from "react";
import NavBar from "../../organisms/NavBar/NavBar";
import ServerIface from "../../../ServerIface";
import ErrorPage from "../../../pages/error_page/ErrorPage";
import "./PageTemplate.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import {
  setGlobalLoading,
  setPopup,
  setServerConnection,
} from "../../../redux/globalSlice";
import PopUp from "../../molecules/PopUp/PopUp";
import { PopUpFunctions } from "../../../common/common";
interface PageTemplateProps {
  content: JSX.Element;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ content }) => {
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

  return (
    <div id="PageTemplate">
      {(globalLoading || loading) && (
        <div id="LoadingPopUp">
          <div className="LoadIcon"></div>
        </div>
      )}
      {!serverConnected && !loading && !globalLoading ? (
        <ErrorPage message={"Failed to connect to the server"} />
      ) : (
        <div id="PageContent">
          <NavBar />
          {popupOpen && (
            <PopUp
              title={
                popup.title ? popup.title : popup.isError ? "Error" : "Success"
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

export default PageTemplate;
