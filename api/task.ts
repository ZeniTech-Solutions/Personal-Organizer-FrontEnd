interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_TASK {
    Get: {
        task: API;
    };
    Post: {
        task: API;
    };
    Put: {
        task: API;
    };
    Delete: {
        task: API;
    };
}

export const API_Task: API_TASK = {
    Get: {
        task: {
            url: `/api/tasks`,
            method: "get",
        },
    },
    Post: {
        task: {
            url: `/api/tasks`,
            method: "post",
        },
    },
    Put: {
        task: {
            url: `/api/tasks`,
            method: "put",
        },
    },
    Delete: {
        task: {
            url: `/api/tasks`,
            method: "delete",
        },
    }
};