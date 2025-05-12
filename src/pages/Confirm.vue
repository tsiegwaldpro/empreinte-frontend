<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-8 text-center" max-width="500" elevation="8">
      <v-card-title class="text-h5 mb-4">
        {{ loading ? "Confirmation en cours..." : message }}
      </v-card-title>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        size="48"
        class="my-4"
      ></v-progress-circular>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api"; // ✅ appel centralisé

const route = useRoute();
const router = useRouter();
const message = ref("Confirmation du compte...");
const loading = ref(true);

onMounted(async () => {
  try {
    const token = route.params.token;
    await api.get(`/api/auth/confirm/${token}`); // ✅ plus d'URL en dur
    message.value =
      "✅ Ton compte est confirmé ! Tu peux maintenant te connecter.";
  } catch (err) {
    message.value = "❌ Ce lien de confirmation est invalide ou expiré.";
  } finally {
    loading.value = false;
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }
});
</script>
