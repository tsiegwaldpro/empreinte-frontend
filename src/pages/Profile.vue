<template>
  <v-container class="py-10">
    <!-- Infos utilisateur -->
    <v-row class="align-center mb-6">
      <v-col cols="12" md="2" class="d-flex justify-center">
        <v-avatar size="80" color="primary" class="text-white">
          <span class="text-h5">{{ initials }}</span>
        </v-avatar>
      </v-col>
      <v-col cols="12" md="10">
        <h2 class="text-h5 font-weight-bold">
          {{ user.firstName }} {{ user.lastName }}
        </h2>
        <p class="mb-1">{{ user.email }}</p>
        <v-chip
          :color="
            user.role === 'admin'
              ? 'deep-purple-accent-4'
              : user.role === 'premium'
              ? 'success'
              : 'primary'
          "
          label
        >
          {{ labelFromRole(user.role) }}
        </v-chip>

        <p class="text-grey text-caption mt-1">
          Inscrit depuis le {{ formatDate(user.createdAt) }}
        </p>

        <!-- Temps restant -->
        <p
          v-if="timeLeft && user.role === 'premium' && !hasExpired"
          class="text-caption mt-1 text-blue"
        >
          ⏳ Il vous reste {{ timeLeft }} de Premium
        </p>
      </v-col>
    </v-row>

    <!-- Activation code premium -->
    <v-card v-if="user.role !== 'premium'" class="pa-4 mt-6" elevation="4">
      <h2 class="text-h6 mb-4">🎟️ Activer un code Premium</h2>

      <v-form @submit.prevent="activateCode" class="d-flex flex-column gap-4">
        <v-text-field
          v-model="premiumCode"
          label="Code Premium"
          variant="outlined"
          density="comfortable"
          required
        />

        <v-btn type="submit" color="primary" :loading="loading" block>
          Activer mon compte Premium
        </v-btn>
      </v-form>

      <v-alert
        v-if="message"
        :type="messageType"
        class="mt-4"
        density="comfortable"
        border="start"
        variant="tonal"
      >
        {{ message }}
      </v-alert>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import api from "@/api";

const user = ref({});
const initials = ref("");
const premiumCode = ref("");
const message = ref(null);
const messageType = ref("success");
const loading = ref(false);
const expiresAt = ref(null);
let interval = null;

const formatDate = (str) =>
  new Date(str).toLocaleDateString("fr-FR", {
    dateStyle: "long",
  });

const labelFromRole = (role) => {
  switch (role) {
    case "admin":
      return "Compte Administrateur";
    case "premium":
      return "Compte Premium";
    default:
      return "Compte Freemium";
  }
};

const hasExpired = computed(() => {
  if (!expiresAt.value) return false;
  return new Date(expiresAt.value) < new Date();
});

const timeLeft = computed(() => {
  if (!expiresAt.value) return null;

  const now = new Date();
  const diffMs = expiresAt.value.getTime() - now.getTime();

  if (diffMs <= 0) return "Premium expiré";

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
});

const activateCode = async () => {
  loading.value = true;
  message.value = null;

  try {
    await api.post("/premium/use-code", { code: premiumCode.value });

    // Recharge les données
    const resUser = await api.get("/auth/me");
    user.value = resUser.data;
    localStorage.setItem("user", JSON.stringify(user.value));

    message.value = "🎉 Votre compte est maintenant Premium pour 24h.";
    messageType.value = "success";
    premiumCode.value = "";

    await fetchExpiration();
  } catch (err) {
    message.value = err.response?.data?.error || "Erreur lors de l’activation.";
    messageType.value = "error";
  } finally {
    loading.value = false;
  }
};

const fetchExpiration = async () => {
  try {
    const res = await api.get("/premium/expiration");
    console.log("📥 Réponse API /premium/expiration :", res.data);

    if (!res.data || !res.data.expiresAt) {
      console.warn("⚠️ Aucun champ 'expiresAt' trouvé dans la réponse.");
      expiresAt.value = null;
      return;
    }

    const rawDate = res.data.expiresAt;
    console.log("🕒 Valeur brue 'expiresAt' :", rawDate);

    const parsedDate = new Date(rawDate);

    if (isNaN(parsedDate.getTime())) {
      console.error("❌ La date reçue n’est pas valide :", rawDate);
      expiresAt.value = null;
      return;
    }

    console.log("✅ Date d’expiration convertie :", parsedDate);
    expiresAt.value = parsedDate;
  } catch (err) {
    console.error("❌ Erreur lors de l'appel à /premium/expiration :", err);
    expiresAt.value = null;
  }
};

onMounted(async () => {
  const resUser = await api.get("/auth/me");
  user.value = resUser.data;

  initials.value = `${user.value.firstName?.[0] || ""}${
    user.value.lastName?.[0] || ""
  }`.toUpperCase();

  if (user.value.role === "premium") {
    await fetchExpiration();

    interval = setInterval(() => {
      // Force la mise à jour de l'affichage de timeLeft
      expiresAt.value = new Date(expiresAt.value);
    }, 60000);
  }
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>
