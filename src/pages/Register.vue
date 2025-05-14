<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-10" max-width="800" elevation="8" width="100%">
      <v-card-title class="text-h5 text-center mb-6">
        📝 Créer un compte
      </v-card-title>

      <v-card-text>
        <v-form
          @submit.prevent="handleRegister"
          class="d-flex flex-column gap-6"
        >
          <v-row dense>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="firstName"
                label="Prénom"
                required
                density="comfortable"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lastName"
                label="Nom"
                required
                density="comfortable"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="email"
            label="Adresse email"
            type="email"
            required
            density="comfortable"
            variant="outlined"
          />

          <v-text-field
            v-model="password"
            label="Mot de passe"
            type="password"
            required
            density="comfortable"
            variant="outlined"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            required
            density="comfortable"
            variant="outlined"
          />

          <v-btn
            :loading="loading"
            type="submit"
            color="primary"
            size="large"
            block
          >
            S'inscrire
          </v-btn>
        </v-form>

        <v-alert v-if="message" type="success" class="mt-6" dense>
          {{ message }}
        </v-alert>

        <v-alert v-if="error" type="error" class="mt-6" dense>
          {{ error }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-center mt-4">
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

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Pré-remplissage automatique en dev uniquement
if (import.meta.env.MODE === "development") {
  firstName.value = "Thomas";
  lastName.value = "Siegwald";
  email.value = "siegwald.thomas@gmail.com";
  password.value = "Yolo2015+";
  confirmPassword.value = "Yolo2015+";
}

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
    const res = await api.post("/auth/register", {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    console.log("✅ Réponse inscription :", res.data);

    message.value =
      "Inscription réussie. Un mail de confirmation vous a été envoyé.";
    localStorage.setItem("showConfirmMessage", "true");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } catch (err) {
    console.error("Erreur API :", err);
    console.error("Réponse complète :", err.response);
    console.error("Message d'erreur :", err.response?.data?.message);

    error.value = err.response?.data?.message || "Erreur lors de l'inscription";
  } finally {
    loading.value = false;
  }
};
</script>
