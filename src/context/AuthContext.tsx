import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../common/common";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({
    display_name: null,
    id: -1,
    token: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    const id = localStorage.getItem("user-id") ?? "-1";
    const display_name = localStorage.getItem("display-name");
    if (id !== "-1" && id !== null) {
      setUser({
        display_name: display_name,
        id: parseInt(id),
        token: token,
      }); // Optionally decode token here
    }
  }, []);

  const login = (new_user: User) => {
    Cookies.set("display-name", new_user.display_name ?? "", { expires: 7 });
    Cookies.set("id", new_user.id?.toString() ?? "-1", { expires: 7 });
    Cookies.set("token", new_user.token ?? "", { expires: 7 });

    setUser(new_user);
  };

  const logout = () => {
    Cookies.remove("display-name");
    Cookies.remove("id");
    Cookies.remove("token");

    setUser({ display_name: null, id: -1, token: null });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
