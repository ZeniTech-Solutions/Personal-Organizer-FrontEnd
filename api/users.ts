interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_USERS {
    Get: {
        users: API;
    };
    Post: {
        users: API;
    };
    Put: {
        users: API;
    };
    Delete: {
        users: API;
    };
}

export const API_Users: API_USERS = {
    Get: {
        users: {
            url: `/api/users`,
            method: "get",
        },
    },
    Post: {
        users: {
            url: `/api/users`,
            method: "post",
        },
    },
    Put: {
        users: {
            url: `/api/users`,
            method: "put",
        },
    },
    Delete: {
        users: {
            url: `/api/users`,
            method: "delete",
        },
    }
};