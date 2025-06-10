interface API {
    url: string;
    method: "get" | "post" | "put" | "delete";
}

interface API_CALENDAR {
    Get: {
        calendar: API;
    };
    Post: {
        calendar: API;
    };
    Put: {
        calendar: API;
    };
    Delete: {
        calendar: API;
    };
}

export const API_Calendar: API_CALENDAR = {
    Get: {
        calendar: {
            url: `/api/calendar`,
            method: "get",
        },
    },
    Post: {
        calendar: {
            url: `/api/calendar`,
            method: "post",
        },
    },
    Put: {
        calendar: {
            url: `/api/calendar`,
            method: "put",
        },
    },
    Delete: {
        calendar: {
            url: `/api/calendar`,
            method: "delete",
        },
    }
};