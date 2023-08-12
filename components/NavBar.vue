<template>
  <v-app-bar color="primary" dense dark>
    <v-app-bar-title
      ><nuxt-link to="/" class="custom-link"
        >AI Tools</nuxt-link
      ></v-app-bar-title
    >

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
    >
      <template v-slot:item="{ props, item }">
        <v-list-item
          v-bind="props"
          :prepend-avatar="item?.raw?.main_image.path"
          :title="item?.raw?.name"
        ></v-list-item>
      </template>
    </v-autocomplete>

    <v-spacer></v-spacer>
    <v-toolbar-items>
      <v-btn flat to="/" nuxt> Home </v-btn>
      <v-btn flat to="/platforms" nuxt> Platforms </v-btn>
      <v-btn flat to="/contact" nuxt> Contact Us </v-btn>
      <v-btn flat @click="logout" nuxt v-if="$userStore.id"> Logout </v-btn>
      <v-btn flat to="/auth/login" nuxt v-if="!$userStore.id"> Login </v-btn>

      <v-btn> Blog </v-btn>
      <v-btn flat to="/admin/dashboard" nuxt v-if="$userStore.isLoggedIn">
        Admin
      </v-btn>
      <v-btn flat class="switch-theme-btn-padding">
        <v-switch v-model="switchTheme" inset @update:modelValue="toggleTheme">
          <template #label>
            <v-icon v-if="switchTheme">{{ darkIcon }}</v-icon>
            <v-icon v-else>{{ lightIcon }}</v-icon>
          </template>
        </v-switch>
      </v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script setup>
import { useTheme } from "vuetify";
const { $axios } = useNuxtApp();
const { $userStore } = useNuxtApp();
const darkIcon = "mdi-theme-light-dark"; // Icon when dark theme is active
const lightIcon = "mdi-lightbulb-on"; // Icon when light theme is active
const switchTheme = ref(false);
const theme = useTheme();

const search = ref("");
const seletedTool = ref("");
const loading = ref(false);
const items = ref([]);
const { debounce } = useUtils();

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  switchTheme.value = theme.global.current.value.dark;
};

function updated(item) {
  if (item) {
    navigateTo({
      path: `/ai-apps/${item.slug}`,
    });
  }
}

const logout = async () => {
  await $userStore.getToken();
  await $userStore.logout();
  navigateTo({
    path: `/auth/login`,
  });
};

async function fetchTools(search) {
  loading.value = true;

  const res = await $axios.get(
    `/api/apps/search?search=${search.target.value}`
  );

  //console.log(res.data);

  loading.value = false;
  items.value = res.data;
}

const debouncedInput = debounce(fetchTools, 300);
watch(search, (newSearch) => {
  if (newSearch) {
    debouncedInput(newSearch);
  } else {
    items.value = [];
  }
});
</script>

<style scoped>
a {
  color: white;
  text-decoration: none;
}
.v-btn--active {
  background-color: red;
}
.switch-theme-btn-padding {
  padding-top: 5px;
  padding-right: 50px;
}
</style>
