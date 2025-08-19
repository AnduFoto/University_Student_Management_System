let updateTokenCallback = null;
let logoutCallback = null;

export const setAuthCallbacks = (updateToken, logoutFn) => {
    updateTokenCallback = updateToken;
    logoutCallback = logoutFn;
};

export const getAuthCallbacks = () => ({
    updateToken: updateTokenCallback || (() => {}),
    logout: logoutCallback || (() => {}),
});
