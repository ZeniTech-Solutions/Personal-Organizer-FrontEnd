interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_JOURNAL {
    Get: {
        entries: API;
    };
    Post: {
        entries: API;
    };
    Put: {
        entries: API;
    };
    Delete: {
        entries: API;
    };
}

export const API_Journal: API_JOURNAL = {
    Get: {
        entries: {
            url: `/api/journal`,
            method: "get",
        },
    },
    Post: {
        entries: {
            url: `/api/journal`,
            method: "post",
        },
    },
    Put: {
        entries: {
            url: `/api/journal`,
            method: "put",
        },
    },
    Delete: {
        entries: {
            url: `/api/journal`,
            method: "delete",
        },
    }
};