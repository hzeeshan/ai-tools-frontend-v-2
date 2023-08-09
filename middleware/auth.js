export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $userStore } = useNuxtApp();

    const router = useRouter();
    if (!$userStore.isLoggedIn) {
        await router.push("/auth/login");
    }
});
