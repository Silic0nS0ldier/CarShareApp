import { route, getCurrentUrl } from "preact-router";

/**
 * A simple wrapper around `fetch` that throws an exception when the access token isn't defined.
 * Will also optionally redirect on authorization failure.
 * @param {string|Request} input
 * @param {RequestInit} init
 * @param {boolean} [redirect]
 */
export default function authorizedFetch(input, init, redirect) {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("access_token does not exist in local storage, user likely logged out.");
    if (!init.headers) {
        init.headers = {};
    }
    init.headers.authorization = token;
    if (redirect) {
        return fetch(input, init)
            .then(response => {
                if (response.status === 401) {
                    route("/login/" + encodeURIComponent(getCurrentUrl()));
                }
                return response;
            });
    } else {
        return fetch(input, init);
    }
}