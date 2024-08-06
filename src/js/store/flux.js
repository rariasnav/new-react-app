const getState = ({ getStore, getActions, setStore }) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const TOKEN = localStorage.getItem("token");

  const createRequestOptions = (
    method,
    body = null,
    isAuthRequired = false
  ) => {
    const headers = { "Content-Type": "application/json" };
    if (isAuthRequired) {
      headers["Authorization"] = `Bearer ${localStorage.getItem("token")}`;
    }
    return {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };
  };
  const handleResponse = async (response) => {
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  };
  return {
    store: {
      personas: ["Pedro", "Maria"],
      loggedUser: false,
    },
    actions: {
      exampleFunction: async () => {
        try {
          const response =
            await fetch`${process.env.REACT_APP_BACKEND_URL}/hello`;
          const data = await response.json();
          console.log(data);
        } catch (error) {}
      },
      createUser: async (user) => {
        try {
          const requestOptions = createRequestOptions("POST", user);
          const response = await fetch(`${baseURL}/signup`, requestOptions);
          if (response.ok) return 201;
        } catch (error) {
          console.error("Error creating user", error);
        }
      },
      login: async (user) => {
        try {
          const requestOptions = createRequestOptions("POST", user);
          const response = await fetch(`${baseURL}/login`, requestOptions);
          const data = await handleResponse(response);
          if (response.ok) {
            localStorage.setItem("token", data.access_token);
            await getActions().getInProfile();
            return true;
          } else {
            console.error("Login failed", data);
          }
        } catch (error) {
          console.error("Error logging in", error);
        }
        getActions().logout();
        return false;
      },
      logout: async () => {
        setStore({ loggedUser: false });
        localStorage.removeItem("token");
      },
      getInProfile: async () => {
        try {
          const requestOptions = createRequestOptions("GET", null, true);
          const response = await fetch(`${baseURL}/profile`, requestOptions);
          const data = await handleResponse(response);
          if (response.ok) {
            setStore({ loggedUser: data.user });
            return true;
          }
        } catch (error) {
          console.error("Error getting profile info", error);
        }
        getActions().logout();
        return false;
      },
      createPost: async (formData) => {
        try {
          const requestOptions = {
            method: "POST",
            headers: { Authorization: `Bearer ${TOKEN}` },
            body: formData,
          };
          const response = await fetch(`${baseURL}/post`, requestOptions);
          if (response.ok) {
            return await response.json();
          } else {
            console.error("Error:", response.statusText);
            return false;
          }
        } catch (error) {
          console.log("Error creating post", error);
          return false;
        }
      },
      getPosts: async () => {
        try {
          const requestOptions = createRequestOptions("GET", null, true);
          const response = await fetch(`${baseURL}/post`, requestOptions);
		  return await handleResponse(response);
        } catch (error) {
			console.log("Error getting posts", error);
		}
      },
    },
  };
};

export default getState;
