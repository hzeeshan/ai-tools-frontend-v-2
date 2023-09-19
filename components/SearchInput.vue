<template>
  <div>
    <v-container>
      <v-autocomplete
        :items="items"
        v-model="seletedTool"
        :loading="loading"
        menu-icon=""
        placeholder="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        @input="debouncedInput"
        :search-input.sync="search"
        item-title="name"
        item-value="id"
        return-object
        hide-details
        @update:model-value="updated"
        :style="autocompleteStyle"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            v-bind="props"
            :prepend-avatar="item?.raw?.main_image.path"
            :title="item?.raw?.name"
          ></v-list-item>
        </template>
      </v-autocomplete>
    </v-container>
  </div>
</template>

<script setup>
const { $axios } = useNuxtApp();
const search = ref("");
const seletedTool = ref("");
const loading = ref(false);
const items = ref([]);
const { debounce } = useUtils();

function updated(item) {
  if (item) {
    navigateTo({
      path: `/ai-apps/${item.slug}`,
    });
  }
}

async function fetchTools(search) {
  //loading.value = true;

  /* const res = await $axios.get(
    `/api/apps/search?search=${search.target.value}`
  ); */
  console.log(search.target.value);
  //console.log(res.data);

  loading.value = false;
  //items.value = res.data;
}

const debouncedInput = debounce(fetchTools, 300);
watch(search, (newSearch) => {
  if (newSearch) {
    debouncedInput(newSearch);
  } else {
    items.value = [];
  }
});
const autocompleteStyle = computed(() => {
  /* if (mobile.value) {
    return "width: 40%; margin-right: 10px;margin-left: 10px";
  } */
  return "";
});
</script>