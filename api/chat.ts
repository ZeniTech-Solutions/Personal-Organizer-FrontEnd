interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_CHAT {
    Get: {
        messages: API;
    };
    Post: {
        message: API;
    };
    Delete: {
        message: API;
    };
    Put: {
        message: API;
    }
}

export const API_Chat: API_CHAT = {
    Get: {
        messages: {
            url: `/api/message`,
            method: "get",
        }
    },
    Post: {
        message: {
            url: `/api/message/send`,
            method: "post",
        },
    },
    Delete: {
        message: {
            url: `/api/message`,
            method: "delete"
        }
    },
    Put: {
        message: {
            url: `/api/message/read`,
            method: "put"
        }
    }
};