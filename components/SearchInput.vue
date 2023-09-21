<template>
  <div>
    <v-autocomplete
      :items="items"
      v-model="seletedTool"
      :loading="loading"
      placeholder=""
      append-inner-icon="mdi-magnify"
      variant="solo"
      @input="debouncedInput"
      :search-input.sync="search"
      item-title="name"
      item-value="id"
      return-object
      hide-details
      @update:model-value="updated"
      :style="autocompleteStyle"
      @focus="isFocused = true"
      @blur="isFocused = false"
      class="my-autocomplete"
    >
      <template v-slot:prepend-inner>
        <span v-if="!seletedTool && !isFocused">{{ currentPlaceholder }}</span>
      </template>

      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :prepend-avatar="item?.raw?.main_image.path"
          :title="item?.raw?.name"
        ></v-list-item>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
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

const currentPlaceholder = ref("I want to create a Twitter thread");
const placeholders = [
  "I want help with my Math work",
  "I want to create logo for my business",
  "I want to book a flight with lowest price",
];
let index = 0;
const isFocused = ref(false);

let interval; // Declare the interval variable

onMounted(() => {
  interval = setInterval(() => {
    // Assign the setInterval to interval
    index = (index + 1) % placeholders.length; // Cycle through the placeholders
    currentPlaceholder.value = placeholders[index];
  }, 2000);
});

onBeforeUnmount(() => {
  clearInterval(interval); // Clear the interval correctly
});
</script>
<style>
.my-autocomplete.v-autocomplete.v-autocomplete--active-menu
  .v-field__append-inner
  > .v-icon {
  transform: none;
}
.my-autocomplete.v-autocomplete .v-field__prepend-inner {
  width: 300px;
}
</style>