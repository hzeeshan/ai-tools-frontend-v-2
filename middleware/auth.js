export default defineNuxtRouteMiddleware(async (to, from) => {
  const { $userStore } = useNuxtApp();

  if (!$userStore.isLoggedIn || !$userStore.hasRole("admin")) {
    return navigateTo("/auth/login");
  }
});
