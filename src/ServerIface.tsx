import store from "./redux/store";
import { setError, setLoading } from "./redux/globalSlice";
import { ErrorCodes, Ingredient } from "./common/common";

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

  constructor(baseUrl: string = "http://127.0.0.1:7777/") {
    this.baseUrl = baseUrl;
  }

  setGlobalError(errorMsg: string) {
    store.dispatch(setError({ isError: true, message: errorMsg }));
  }

  async connect() {
    store.dispatch(setLoading(true));
    try {
      const response = await fetch(`${this.baseUrl}health`, {
        method: "GET",
      });

      store.dispatch(setLoading(false));
      return await response.json();
    } catch (error: any) {
      store.dispatch(setLoading(false));
      console.error("GET request failed:", error);
      const err_msg = error.message + ": connect";
      this.setGlobalError(err_msg);
    }
    store.dispatch(setLoading(false));
  }

  async get(endpoint: string) {
    store.dispatch(setLoading(true));

    // const request_headers: HeadersInit = new Headers();
    // request_headers.set("Authorization", "Bearer 123");

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        // headers: request_headers,
        method: "GET",
      });
      store.dispatch(setLoading(false));
      return await response.json();
    } catch (error: any) {
      store.dispatch(setLoading(false));
      console.error("GET request failed:", error);
      this.setGlobalError(error.message + ": " + endpoint);
    }
    store.dispatch(setLoading(false));
  }

  async get_search(sub_url: string, param: string) {
    store.dispatch(setLoading(true));
    let url = `${this.baseUrl}${sub_url}?search=${param}`;

    try {
      const response = await fetch(url, {
        method: "GET",
      });
      store.dispatch(setLoading(false));
      return await response.json();
    } catch (error: any) {
      store.dispatch(setLoading(false));
      console.error("GET request failed:", error);
      this.setGlobalError(error.message + ": " + sub_url);
    }
    store.dispatch(setLoading(false));
  }

  async login(username: string, password: string) {
    store.dispatch(setLoading(true));
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
        store.dispatch(setLoading(false));
        return {
          success: false,
          err: ErrorCodes.USERNAME_WRONG,
          message: "No user found",
        };
      }

      if (response.status === ErrorCodes.PASSWORD_WRONG) {
        store.dispatch(setLoading(false));
        return {
          success: false,
          err: ErrorCodes.PASSWORD_WRONG,
          message: "Invalid password",
        };
      }

      if (response.status !== 200) {
        store.dispatch(setLoading(false));
        return {
          success: false,
          err: ErrorCodes.DEFAULT,
          message: "Unexpected error",
        };
      }

      const res = await response.json();
      store.dispatch(setLoading(false));
      return res;
    } catch (error: any) {
      console.log("Login error:", error);
      store.dispatch(setLoading(false));

      return {
        success: false,
        err: ErrorCodes.DEFAULT,
        message: "Unexpected error",
      };
    }
  }

  async getImage(image_name: string) {
    store.dispatch(setLoading(true));
    try {
      const response = await fetch(
        `${this.baseUrl}images?search=${image_name}`
      );

      let res = await response.json();

      if (res === undefined) {
        console.error("GET request failed:", res.error);
        this.setGlobalError(
          `Failed to get image '${image_name}': ` + res.error
        );
      }

      store.dispatch(setLoading(false));
      return res;
    } catch (error: any) {
      store.dispatch(setLoading(false));
      console.error("GET request failed:", error);
      this.setGlobalError(
        `Failed to get image '${image_name}': ` + error.message
      );
    }
    store.dispatch(setLoading(false));
  }

  async uploadImage(file: File) {
    store.dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("file", file);

    console.log("Formdata Name: ", file.name);

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
        console.log("Image upload failed:", response.statusText);
        res.success = false;
        res.message = "Failed to upload image";
        this.setGlobalError(res.message);
        store.dispatch(setLoading(false));
        return res;
      }
      const result = response;
      res.success = result.ok;
      res.message = await result.json();
    } catch (error) {
      console.log("Image upload failed:", error);
      res.success = false;
      res.message = "Failed to upload image";
      this.setGlobalError(res.message);
      store.dispatch(setLoading(false));
    }
    store.dispatch(setLoading(false));
    return res;
  }

  async post(endpoint: string, data: any) {
    store.dispatch(setLoading(true));
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      store.dispatch(setLoading(false));
      return await response.json();
    } catch (error: any) {
      console.error("POST request failed:", error);
      this.setGlobalError(error.message + ": " + endpoint);
      store.dispatch(setLoading(false));
    }
    store.dispatch(setLoading(false));
  }

  async delete(endpoint: string) {
    store.dispatch(setLoading(true));
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "DELETE",
      });
      store.dispatch(setLoading(false));
      return await response.json();
    } catch (error: any) {
      console.error("DELETE request failed:", error);
      this.setGlobalError(error.message + ": " + endpoint);
      store.dispatch(setLoading(false));
    }
    store.dispatch(setLoading(false));
  }

  async put_recipe(data: PutRecipeIface, id: string) {
    store.dispatch(setLoading(true));
    try {
      console.log("PUT recipe DATA: ", data);
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
      store.dispatch(setLoading(false));
      return { res };
    } catch (error: any) {
      console.error("PUT request failed:", error);
      this.setGlobalError(error.message + ": Failed to update recipe");
      store.dispatch(setLoading(false));
    }
    store.dispatch(setLoading(false));
  }

  async post_recipe(data: PostRecipeIface) {
    store.dispatch(setLoading(true));
    try {
      const response = await fetch(`${this.baseUrl}recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let res = await response.json();
      if (!res.success) {
        console.error("POST request failed:", res.error);
        this.setGlobalError("Failed to create recipe: " + res.error);
      }
      store.dispatch(setLoading(false));
      return res;
    } catch (error: any) {
      console.error("POST request failed:", error);
      this.setGlobalError(error.message + ": Failed to create recipe");
      store.dispatch(setLoading(false));
    }
    store.dispatch(setLoading(false));
  }
}

export default ServerIface;
