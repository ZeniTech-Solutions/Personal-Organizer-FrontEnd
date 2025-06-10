interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_CONTACTS {
    Get: {
        contacts: API;
    };
    Post: {
        contacts: API;
    };
    Put: {
        contacts: API;
    };
    Delete: {
        contacts: API;
    };
}

export const API_Contacts: API_CONTACTS = {
    Get: {
        contacts: {
            url: `/api/contacts`,
            method: "get",
        },
    },
    Post: {
        contacts: {
            url: `/api/contacts`,
            method: "post",
        },
    },
    Put: {
        contacts: {
            url: `/api/contacts`,
            method: "put",
        },
    },
    Delete: {
        contacts: {
            url: `/api/contacts`,
            method: "delete",
        },
    }
};