interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_MILESTONE {
    Get: {
        milestone: API;
    };
    Post: {
        milestone: API;
    };
    Put: {
        milestone: API;
    };
    Delete: {
        milestone: API;
    };
}

export const API_Milestone: API_MILESTONE = {
    Get: {
        milestone: {
            url: `/api/milestone`,
            method: "get",
        },
    },
    Post: {
        milestone: {
            url: `/api/milestone`,
            method: "post",
        },
    },
    Put: {
        milestone: {
            url: `/api/milestone`,
            method: "put",
        },
    },
    Delete: {
        milestone: {
            url: `/api/milestone`,
            method: "delete",
        },
    }
};