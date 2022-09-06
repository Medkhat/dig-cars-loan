const APIUrl = import.meta.env.DEV ? import.meta.env.AC_DEV_API : import.meta.env.AC_PROD_API;
const WSUrl = import.meta.env.DEV ? import.meta.env.AC_DEV_WS : import.meta.env.AC_PROD_WS;
const landingURL = import.meta.env.DEV ? import.meta.env.AC_DEV_LANDING : import.meta.env.AC_PROD_LANDING;

export { APIUrl, landingURL, WSUrl };
