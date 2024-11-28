const getURL = typeof window === "undefined" ? null : window?.location.href;
const develop = "https://develop--";
export const devMode = getURL?.includes(develop) || null;
