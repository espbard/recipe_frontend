import store from "./redux/store";
import { setError, setPopup } from "./redux/globalSlice";
import { ErrorCodes, Ingredient } from "./common/common";
import { S3Client } from "@aws-sdk/client-s3";

const ACCESS_KEY_ID = "d0ee871c416143ddf346f1abdce1364f";
const ACCESS_KEY_SECRET =
  "842d78f2cece773ab4de5f4a596be6e1aebf22ecd8d2d013635cd90ef1d62a00";
const R2_ENPOINT =
  "https://baec190b8cc3c8c7d0a4e06fb6bdcbc6.r2.cloudflarestorage.com";
const CDN_URL = "https://cdn-server.espen-bardevik.workers.dev/";

interface PutRecipeIface {
  title: string;
  description: string;
  image: string;
  instructions: string[];
  ingredients: Ingredient[];
  tags: string[];
}

interface PostRecipeIface {
  user_id: number;
  title: string;
  description: string;
}

class ServerIface {
  baseUrl: string;

  constructor(
    baseUrl: string = process.env.REACT_APP_BACKEND_BASE_URL ||
      "https://recipebackend-production-570f.up.railway.app/"
  ) {
    this.baseUrl = baseUrl;
    // this.baseUrl = "http://localhost:7777/";
  }

  setGlobalError(errorMsg: string) {
    store.dispatch(setError({ isError: true, message: errorMsg }));
    store.dispatch(setPopup({ open: true, isError: true, message: errorMsg }));
  }

  async connect() {
    try {
      const response = await fetch(`${this.baseUrl}health`, {
        method: "GET",
      });

      return await response.json();
    } catch (error: any) {
      console.error("GET request failed:", error);
      const err_msg = error.message + ": connect";
      this.setGlobalError(err_msg);
    }
  }

  async get(endpoint: string) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
      });
      return await response.json();
    } catch (error: any) {
      console.error("GET request failed:", error);
      this.setGlobalError(error.message + ": " + endpoint);
    }
  }

  async get_search(sub_url: string, param: string) {
    let url = `${this.baseUrl}${sub_url}?search=${param}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });
      const res = await response.json();
      return res;
    } catch (error: any) {
      console.error("GET request failed:", error);
      this.setGlobalError(error.message + ": " + sub_url);
    }
  }

  async login(username: string, password: string) {
    let data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(`${this.baseUrl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === ErrorCodes.USERNAME_WRONG) {
        return {
          success: false,
          err: ErrorCodes.USERNAME_WRONG,
          message: "No user found",
        };
      }

      if (response.status === ErrorCodes.PASSWORD_WRONG) {
        return {
          success: false,
          err: ErrorCodes.PASSWORD_WRONG,
          message: "Invalid password",
        };
      }

      if (response.status !== 200) {
        return {
          success: false,
          err: ErrorCodes.DEFAULT,
          message: "Unexpected error",
        };
      }

      const res = await response.json();
      return res;
    } catch (error: any) {
      console.error("Login error:", error);

      return {
        success: false,
        err: ErrorCodes.DEFAULT,
        message: "Unexpected error",
      };
    }
  }

  getCdn() {
    return CDN_URL;
  }

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    let res = {
      success: false,
      message: "",
    };

    try {
      const response = await fetch(`${this.baseUrl}upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Image upload failed:", response.statusText);
        res.success = false;
        res.message = "Failed to upload image";
        this.setGlobalError(res.message);
        return res;
      }
      const result = response;
      res.success = result.ok;
      res.message = await result.json();
    } catch (error) {
      console.error("Image upload failed:", error);
      res.success = false;
      res.message = "Failed to upload image";
      this.setGlobalError(res.message);
    }
    return res;
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error: any) {
      console.error("POST request failed:", error);
      this.setGlobalError(error.message + ": " + endpoint);
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
      });
      let data = response.status;

      if (data !== 200) {
        console.error("DELETE request failed:", data);
        this.setGlobalError("Failed to delete: " + data);
        return;
      }

      return data;
    } catch (error: any) {
      console.error("DELETE request failed:", error);
      this.setGlobalError(error.message + ": " + endpoint);
    }
  }

  async put_recipe(data: PutRecipeIface, id: string) {
    try {
      const response = await fetch(`${this.baseUrl}recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = {
        success: response.ok,
        message: await response.json(),
      };
      if (!res.success) {
        console.error("PUT request failed:", res.message);
        this.setGlobalError("Failed to update recipe: " + res.message);
      }
      return { res };
    } catch (error: any) {
      console.error("PUT request failed:", error);
      this.setGlobalError(error.message + ": Failed to update recipe");
    }
  }

  async post_recipe(data: PostRecipeIface) {
    try {
      const response = await fetch(`${this.baseUrl}recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await response.json();
      if (res.id <= 0) {
        console.error("POST request failed:", res.error);
        this.setGlobalError("Failed to create recipe: " + res.error);
      }
      return res;
    } catch (error: any) {
      console.error("POST request failed:", error);
      this.setGlobalError(error.message + ": Failed to create recipe");
    }
  }

  async register(name: string, username: string, password: string) {
    let data = {
      username: username,
      display_name: name,
      password: password,
    };

    try {
      const response = await fetch(`${this.baseUrl}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let error_msg = "Unexpected error";

      switch (response.status) {
        case 200: {
          const res = await response.json();
          return res;
        }
        case ErrorCodes.USERNAME_WRONG:
        case ErrorCodes.USERNAME_INVALID: {
          error_msg = "Invalid username";
          break;
        }
        case ErrorCodes.USERNAME_TAKEN: {
          error_msg = "Username is taken";
          break;
        }
        case ErrorCodes.PASSWORD_WRONG:
        case ErrorCodes.PASSWORD_INVALID:
        case ErrorCodes.PASSWORD_LENGTH_INVALID: {
          error_msg =
            "Invalid password.\nPassword must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
          break;
        }
        case ErrorCodes.DISPLAY_NAME_INVALID: {
          error_msg = "Invalid display name";
          break;
        }
        case ErrorCodes.DISPLAY_NAME_TAKEN: {
          error_msg = "Display name is taken";
          break;
        }
      }

      return {
        success: false,
        err: response.status,
        message: error_msg,
      };
    } catch (error: any) {
      console.error("Register error:", error);

      return {
        success: false,
        err: error,
        message: "Unexpected error",
      };
    }
  }
}

export default ServerIface;
