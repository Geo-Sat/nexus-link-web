export const getConfig = () => {
    // If window.env exists (runtime), use it, otherwise use build-time import.meta.env
    if (window.env) {
        return window.env;
    }
    return {
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        VITE_WS_BASE_URL: import.meta.env.VITE_WS_BASE_URL
    };
};