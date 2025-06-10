interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_NOTES {
    Get: {
        notes: API;
    };
    Post: {
        notes: API;
    };
    Put: {
        notes: API;
    };
    Delete: {
        notes: API;
    };
}

export const API_Notes: API_NOTES = {
    Get: {
        notes: {
            url: `/api/notes`,
            method: "get",
        },
    },
    Post: {
        notes: {
            url: `/api/notes`,
            method: "post",
        },
    },
    Put: {
        notes: {
            url: `/api/notes`,
            method: "put",
        },
    },
    Delete: {
        notes: {
            url: `/api/notes`,
            method: "delete",
        },
    }
};