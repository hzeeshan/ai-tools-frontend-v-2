export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBaseUrl;

    const res = await fetch(baseURL + "categories");

    const data = await res.json();

    return data;
});
