export default function useDataFetch() {
  const { $axios } = useNuxtApp();
  const platforms = ref([]);
  const categories = ref([]);
  const licenceTypes = ref([]);
  const listOfCategories = ref([]);
  const tags = ref([]);

  const getPlatforms = async () => {
    const { data } = await $axios.get(`/api/platforms`);
    platforms.value = data;
  };

  const getRelatedCategories = async (platformId) => {
    const { data } = await $axios.get(`/api/categories/${platformId}`);
    categories.value = data;
  };

  const getListOfCategories = async () => {
    const { data } = await $axios.get(`/api/all-categories`);
    listOfCategories.value = data;
  };

  const getListOfTags = async () => {
    const { data } = await $axios.get(`/api/tags`);
    tags.value = data;
  };

  const getLicenceTypes = async () => {
    const { data } = await $axios.get(`/api/license-types`);
    licenceTypes.value = data;
  };

  return {
    platforms,
    categories,
    licenceTypes,
    listOfCategories,
    tags,
    getPlatforms,
    getRelatedCategories,
    getLicenceTypes,
    getListOfCategories,
    getListOfTags,
  };
}
