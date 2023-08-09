const categoriesList = async () => {
    try {
        const { data } = await useFetch("/api/categories");
        return data;
    } catch (e) {
        console.error(e + " error");
        return [];
    }
};

export const useCategories = () => {
    return { categoriesList };
};
