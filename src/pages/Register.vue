<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-8" max-width="600" elevation="8">
      <v-card-title class="text-h5 text-center mb-4"
        >📝 Créer un compte</v-card-title
      >

      <v-card-text>
        <v-form
          @submit.prevent="handleRegister"
          class="d-flex flex-column gap-4"
        >
          <div class="d-flex gap-4">
            <v-text-field
              v-model="firstName"
              label="Prénom"
              required
              density="comfortable"
              variant="outlined"
              class="flex-grow-1"
            />
            <v-text-field
              v-model="lastName"
              label="Nom"
              required
              density="comfortable"
              variant="outlined"
              class="flex-grow-1"
            />
          </div>

          <v-text-field
            v-model="email"
            label="Adresse email"
            type="email"
            required
            density="comfortable"
            variant="outlined"
            class="w-100"
          />

          <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            required
            density="comfortable"
            variant="outlined"
            class="w-100"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            required
            density="comfortable"
            variant="outlined"
            class="w-100"
          />

          <v-btn :loading="loading" type="submit" color="primary" block>
            S'inscrire
          </v-btn>
        </v-form>

        <v-alert v-if="message" type="success" class="mt-4" dense>
          {{ message }}
        </v-alert>

        <v-alert v-if="error" type="error" class="mt-4" dense>
          {{ error }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          variant="text"
          to="/login"
          size="small"
          class="text-grey-lighten-1"
        >
          Déjà inscrit ? Se connecter
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api"; // ✅ instance centralisée

const firstName = ref("Thomas");
const lastName = ref("Siegwald");
const email = ref("siegwald.thomas@gmail.com");
const password = ref("Yolo2015+");
const confirmPassword = ref("Yolo2015+");

const error = ref("");
const message = ref("");
const loading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  message.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Les mots de passe ne correspondent pas.";
    loading.value = false;
    return;
  }

  try {
    await api.post("/auth/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });
    console.log("Réponse inscription :", res.data);
    message.value =
      "Inscription réussie. Un mail de confirmation vous a été envoyé.";
    localStorage.setItem("showConfirmMessage", "true");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (err) {
    console.error("Erreur API :", err);
    console.error("Réponse complète :", err.response);
    error.value = err.response?.data?.message || "Erreur lors de l'inscription";
  } finally {
    loading.value = false;
  }
};
</script>
