
export const IS_PROD = import.meta.env.MODE === "production";
export const VERSION_FORMATTED = 'v' + APP_VERSION + (IS_PROD ? "" : " (dev build)");
