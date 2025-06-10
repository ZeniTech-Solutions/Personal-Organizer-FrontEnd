interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_DOCUMENTS {
    Get: {
        documents: API;
        createFile: API;
    };
    Post: {
        documents: API;
        createFile: API;
    };
    Put: {
        documents: API;
    }
    Delete: {
        documents: API;
    };
}

export const API_Documents: API_DOCUMENTS = {
    Get: {
        documents: {
            url: `/api/documents/users`,
            method: "get",
        },
        createFile: {
            url: `/api/documents/get-file`,
            method: "post",
        }
    },
    Post: {
        documents: {
            url: `/api/documents`,
            method: "post",
        },
        createFile: {
            url: `/api/documents/create-file`,
            method: "post",
        }
    },
    Put: {
        documents: {
            url: `/api/documents`,
            method: "put",
        },
    },
    Delete: {
        documents: {
            url: `/api/documents`,
            method: "delete",
        },
    }
};