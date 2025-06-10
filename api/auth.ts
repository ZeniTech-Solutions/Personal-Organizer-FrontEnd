interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_LOGIN {
    Post: {
        logIn: API;
    };
}

interface API_SIGNOUT {
    Post: {
        signOut: API;
    };
}

export const API_LogIn: API_LOGIN = {
  Post: {
    logIn: {
      url: `/login`,
      method: "post",
    },
  },
};

export const API_SignOut: API_SIGNOUT = {
  Post: {
    signOut: {
      url: `/logout`,
      method: "post",
    },
  },
};