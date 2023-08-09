import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  axios.defaults.withCredentials = true;

  if (typeof window !== "undefined") {
    axios.defaults.baseURL = window.location.hostname.includes("localhost")
      ? "http://localhost:8000"
      : "https://api.aiappsuniverse.com";
  } else {
    // Default to development in SSR context, or make a similar check based on server context
    axios.defaults.baseURL = "http://localhost:8000";
  }

  return {
    provide: {
      axios: axios,
    },
  };
});
