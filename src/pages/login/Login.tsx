import React, { useState } from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate";
import CustomInput from "../../components/molecules/CustomInput/CustomInput";
import ServerIface from "../../ServerIface";
import "./Login.scss";
import { CustomButton } from "../../components/atoms/CustomButton/CustomButton";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ErrorCodes } from "../../common/common";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidUsername, setInvalidUsername] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("Invalid username");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("Invalid password");

  const { login } = useAuth();
  const navigate = useNavigate();

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
        console.log("Login successful: ", response);
        const { display_name, id, token } = response;
        login({ display_name: display_name, id: id, token: token });
        navigate("/");
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const clearErrors = () => {
    setInvalidUsername(false);
    setInvalidPassword(false);
  };

  return (
    <PageTemplate
      disableSideBar
      content={
        <div className="LoginPage">
          <div className="LoginpageContainer">
            <div className="LoginTitleContainer">
              <h2 className="LoginTitle">Sign In</h2>
            </div>
            <form onSubmit={(e) => handleLogin(username, password)}>
              <div className="LoginContent">
                <div className="LoginRow">
                  <label htmlFor="username" className="LoginSubTitle">
                    Username:
                  </label>

                  <div className="LoginInputContainer">
                    <CustomInput
                      type="text"
                      placeholder="Enter username"
                      autocomplete={true}
                      invalid={invalidUsername}
                      invalidMessage={usernameErrorMsg}
                      onChange={setUsername}
                      onKeyDown={() => handleLogin(username, password)}
                      clearErrors={clearErrors}
                    />
                  </div>
                </div>
                <div className="LoginRow">
                  <label htmlFor="password" className="LoginSubTitle">
                    Password:
                  </label>
                  <div className="LoginInputContainer">
                    <CustomInput
                      type="password"
                      placeholder="Enter password"
                      autocomplete={true}
                      invalid={invalidPassword}
                      invalidMessage={passwordErrorMsg}
                      onChange={setPassword}
                      onKeyDown={() => handleLogin(username, password)}
                      clearErrors={clearErrors}
                    />
                  </div>
                </div>
              </div>
              <div className="LoginRow">
                <CustomButton
                  label="Sign In"
                  onClick={() => handleLogin(username, password)}
                />
              </div>
            </form>
          </div>
        </div>
      }
    />
  );
};

export default Login;
