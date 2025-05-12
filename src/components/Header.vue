<template>
  <v-app-bar color="primary" flat app dark>
    <v-container class="d-flex justify-space-between align-center">
      <RouterLink to="/" class="text-white text-decoration-none text-h6">
        🌿 Empreinte
      </RouterLink>

      <div>
        <v-btn
          v-if="isAuthenticated"
          to="/dashboard"
          variant="text"
          class="text-white"
        >
          Dashboard
        </v-btn>

        <v-btn
          v-if="!isAuthenticated"
          to="/login"
          variant="text"
          class="text-white"
        >
          Connexion
        </v-btn>

        <v-btn v-else @click="logout" variant="text" class="text-white">
          Déconnexion
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useRouter } from "vue-router";

const isAuthenticated = ref(false);
const router = useRouter();

const checkAuth = () => {
  isAuthenticated.value = !!localStorage.getItem("token");
};

// Réactif à chaque changement de localStorage (refresh/page load)
onMounted(checkAuth);
watchEffect(checkAuth);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>
