import React, { useEffect } from "react";
import NavBar from "../../organisms/NavBar/NavBar";
import SideBar from "../../organisms/SideBar/SideBar";
import ServerIface from "../../../ServerIface";
import "./PageTemplate.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setError, setServerConnection } from "../../../redux/globalSlice";
import { PopUp } from "../../molecules/PopUp/PopUp";
import ErrorPage from "../../../pages/error_page/ErrorPage";
import classNames from "classnames";

interface PageTemplateProps {
  content: JSX.Element;
  disableSideBar?: boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({
  content,
  disableSideBar,
}) => {
  const value = useAppSelector((state) => state.global.error);
  const [serverConnected, setServerConnected] = React.useState(false);
  const dispatch = useAppDispatch();

  const onRetry = () => {
    dispatch(
      setError({
        isError: false,
        message: "",
      })
    );
    window.location.reload();
  };

  const onClose = () => {
    dispatch(
      setError({
        isError: false,
        message: "",
      })
    );
  };

  const title = `Our Recipes`;
  const server_connection = useAppSelector(
    (state) => state.global.server_connection
  );

  const loading = useAppSelector((state) => state.global.loading);

  useEffect(() => {
    function connectToServer() {
      if (!serverConnected) {
        if (server_connection === true) {
          setServerConnected(true);
        } else {
          let iface = new ServerIface();
          iface.connect().then((res) => {
            if (res !== undefined) {
              setServerConnected(true);
              dispatch(setServerConnection(true));
            }
          });
        }
      }
    }
    connectToServer();
  }, [dispatch, serverConnected, server_connection]);

  const content_classes = classNames("PageContent", {
    DisableSideBar: disableSideBar,
  });
  return (
    <div id="PageTemplate">
      {loading === true && (
        <div id="LoadingPopUp">
          <div className="loader"></div>
        </div>
      )}
      {serverConnected !== true && loading === false ? (
        <ErrorPage message="Failed to connect to server!" />
      ) : (
        <div className={content_classes}>
          {!disableSideBar && <SideBar />}

          <NavBar title={title} centered={disableSideBar} />
          {value.isError && (
            <PopUp
              title="Error"
              text={value.message}
              leftButtonText="Reload"
              rightButtonText="Close"
              onClickLeft={onRetry}
              onClickRight={onClose}
            />
          )}

          <div id="MainContent">{content}</div>
        </div>
      )}
    </div>
  );
};

export default PageTemplate;
