<template>
  <v-app-bar color="primary" flat app dark>
    <v-container class="d-flex justify-space-between align-center">
      <RouterLink to="/" class="text-white text-decoration-none text-h6">
        🌿 Empreinte
      </RouterLink>

      <div class="d-flex align-center gap-2">
        <v-btn
          v-if="auth.isAuthenticated"
          to="/dashboard"
          variant="text"
          class="text-white"
        >
          Dashboard
        </v-btn>

        <!-- ✅ Bouton admin visible uniquement pour les admins -->
        <v-btn
          v-if="auth.isAuthenticated && auth.user?.role === 'admin'"
          to="/admin"
          variant="text"
          class="text-white"
        >
          Admin
        </v-btn>

        <v-btn
          v-if="!auth.isAuthenticated"
          to="/login"
          variant="text"
          class="text-white"
        >
          Connexion
        </v-btn>

        <v-btn
          v-if="auth.isAuthenticated"
          @click="logout"
          variant="text"
          class="text-white"
        >
          Déconnexion
        </v-btn>

        <v-btn
          v-if="auth.isAuthenticated"
          to="/profile"
          icon
          class="text-white"
        >
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = useAuthStore();

const logout = () => {
  auth.logout();
  router.push("/login");
};
</script>
