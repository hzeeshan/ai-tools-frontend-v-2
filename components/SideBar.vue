<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer
        color="primary accent-4"
        permanent
        class="navigation-drawer"
        style="width: 100%"
      >
        <v-list>
          <v-list-item prepend-icon="mdi-view-dashboard" to="/admin/dashboard"
            >Dashboard</v-list-item
          >
          <v-list-item prepend-icon="mdi-account-box" to="/admin/apps">
            Apps</v-list-item
          >
          <v-list-item prepend-icon="mdi-gavel" to="/admin/categories"
            >Categories</v-list-item
          >
          <v-list-item prepend-icon="mdi-home" to="/">Home</v-list-item>
        </v-list>

        <template v-slot:append>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                v-bind="props"
                class="d-flex justify-center mx-auto mb-9"
              >
                <v-avatar color="brown" size="large">
                  <span class="text-h5">{{ user.initials }}</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar color="brown">
                    <span class="text-h5">{{ user.initials }}</span>
                  </v-avatar>
                  <h3>{{ $userStore.name }}</h3>
                  <p class="text-caption mt-1">
                    {{ $userStore.email }}
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn rounded variant="text" @click="getUser">
                    Edit Account
                  </v-btn>
                  <v-divider class="my-3"></v-divider>
                  <v-btn rounded variant="text" @click="logout"> Logout </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-navigation-drawer>
      <v-main style="height: calc(100vh - 5vh)"></v-main>
    </v-layout>
  </v-card>
</template>
<script setup>
const { $userStore } = useNuxtApp();

const getUser = async () => {
  await $userStore.getToken();
  await $userStore.getUser();
  console.log($userStore.id);
};
const user = ref({
  initials: "JD",
  fullName: "John Doe",
  email: "john.doe@doe.com",
});
const logout = async () => {
  await $userStore.logout();
  navigateTo({
    path: `/auth/login`,
  });
};
</script>
<style scoped>
.navigation-drawer {
  padding-top: 10px;
}
.v-list-item--active {
  background-color: #000000;
}
</style>