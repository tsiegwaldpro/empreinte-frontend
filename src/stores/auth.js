// src/stores/auth.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(!!localStorage.getItem("token"));
  const user = ref(null);

  // 🔁 Recharger le user depuis le localStorage (si présent)
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
    } catch (e) {
      console.warn("User en localStorage mal formaté", e);
      user.value = null;
    }
  }

  function login(token, userData) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    isAuthenticated.value = true;
    user.value = userData;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    isAuthenticated.value = false;
    user.value = null;
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
  };
});
