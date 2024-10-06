const BASE_URL = "https://localhost:7293";


export const apiGet = async (route) => {
    const response = await fetch(`${BASE_URL}${route}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch data.");
    }
    return response.json();
};


export const apiPost = async (route, body) => {
    const response = await fetch(`${BASE_URL}${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error("Failed to post data.");
    }
    return response.json();
};


export const apiPut = async (route, body) => {
    const response = await fetch(`${BASE_URL}${route}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error("Failed to update data.");
    }
    return response.json();
};

export const apiDelete = async (route) => {
    const response = await fetch(`${BASE_URL}${route}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete data.");
    }
    return response.json();
};