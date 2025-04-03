import React, { useState } from "react";
import "./Login.scss";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import CustomInput from "../../components/molecules/CustomInput/CustomInput";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ServerIface from "../../ServerIface";
import { ErrorCodes } from "../../common/common";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [usernameErrorMsg, setUsernameErrorMsg] = useState("Invalid username");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("Invalid password");

  const { login } = useAuth();

  const handleLogin = async (username: string, password: string) => {
    if (username.length === 0) {
      setUsernameErrorMsg("Please enter username");
      setInvalidUsername(true);
    }
    if (password.length === 0) {
      setPasswordErrorMsg("Please enter password");
      setInvalidPassword(true);
    }
    if (username.length === 0 || password.length === 0) {
      return;
    }

    try {
      const iface = new ServerIface();
      const response = await iface.login(username, password);

      if (response.success === false) {
        if (response.err === ErrorCodes.USERNAME_WRONG) {
          setUsernameErrorMsg("Invalid username");
          setInvalidUsername(true);
        }
        if (response.err === ErrorCodes.PASSWORD_WRONG) {
          setPasswordErrorMsg("Invalid password");
          setInvalidPassword(true);
        }
      } else {
        const { display_name, id, token } = response;
        login({ display_name: display_name, id: id, token: token });
        navigate("/");
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const navigate = useNavigate();

  const clearErrors = () => {
    setInvalidUsername(false);
    setInvalidPassword(false);
  };

  return (
    <PageTemplate
      content={
        <div id="LoginPage">
          <div className="LoginPageRow" id="LoginInputContainer">
            <div className="LoginInputRow">
              <p className="LoginSubTitle">Username: </p>
              <CustomInput
                type="text"
                placeholder=""
                autocomplete={true}
                invalid={invalidUsername}
                invalidMessage={usernameErrorMsg}
                onChange={setUsername}
                largePadding
                onKeyDown={() => handleLogin(username, password)}
                clearErrors={clearErrors}
              />
            </div>
            <div className="LoginInputRow">
              <p className="LoginSubTitle">Password: </p>
              <CustomInput
                type="password"
                placeholder=""
                autocomplete={true}
                invalid={invalidPassword}
                invalidMessage={passwordErrorMsg}
                onChange={setPassword}
                largePadding
                onKeyDown={() => handleLogin(username, password)}
                clearErrors={clearErrors}
              />
            </div>
          </div>
          <div className="LoginPageRow" id="ButtonRow">
            <div className="ButtonContainer">
              <CustomButton
                color="white"
                background="green"
                size="large"
                label={"Sign In"}
                onClick={() => handleLogin(username, password)}
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Login;
