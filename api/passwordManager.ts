interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_PASSWORDMANAGER {
    Get: {
        password: API;
    };
    Post: {
        password: API;
    };
    Put: {
        password: API;
    };
    Delete: {
        password: API;
    };
}

export const API_PasswordManager: API_PASSWORDMANAGER = {
    Get: {
        password: {
            url: `/api/password`,
            method: "get",
        },
    },
    Post: {
        password: {
            url: `/api/password`,
            method: "post",
        },
    },
    Put: {
        password: {
            url: `/api/password`,
            method: "put",
        },
    },
    Delete: {
        password: {
            url: `/api/password`,
            method: "delete",
        },
    }
};