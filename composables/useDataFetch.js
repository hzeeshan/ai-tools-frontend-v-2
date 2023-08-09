export default function useDataFetch() {
    const { $axios } = useNuxtApp();
    const categories = ref([]);
    const subcategories = ref([]);
    const licenceTypes = ref([]);

    const getCategories = async () => {
        const { data } = await $axios.get(`/api/categories`);
        categories.value = data;
    };

    const getRelatedSubCategories = async (categoryId) => {
        const { data } = await $axios.get(`/api/subcategories/${categoryId}`);
        subcategories.value = data;
    };

    const getLicenceTypes = async () => {
        const { data } = await $axios.get(`/api/license-types`);
        licenceTypes.value = data;
    };

    return {
        categories,
        subcategories,
        licenceTypes,
        getCategories,
        getRelatedSubCategories,
        getLicenceTypes,
    };
}
