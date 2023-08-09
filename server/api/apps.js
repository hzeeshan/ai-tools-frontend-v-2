export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const baseURL = config.public.baseURL;
    try {
        const res = await fetch(baseURL + "apps");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        return data;
    } catch (error) {
        console.error("There was a problem with the fetch operation: ", error);
        throw error; // ensure the error gets propagated
    }
});
