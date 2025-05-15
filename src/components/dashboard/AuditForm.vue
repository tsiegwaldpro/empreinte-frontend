<template>
  <v-form @submit.prevent="handleAudit" class="mb-4">
    <v-row no-gutters>
      <v-col cols="10">
        <v-text-field
          v-model="url"
          :disabled="loading"
          placeholder="Ex : thomassiegwald.fr"
          hide-details
          density="comfortable"
          variant="outlined"
          color="primary"
          class="rounded-s"
          style="border-top-right-radius: 0; border-bottom-right-radius: 0"
        />
      </v-col>
      <v-col cols="2">
        <v-btn
          :loading="loading"
          type="submit"
          color="primary"
          block
          height="100%"
          class="rounded-e"
          style="border-top-left-radius: 0; border-bottom-left-radius: 0"
          :disabled="!url.trim()"
          title="Lancer l'audit"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <p v-if="error" class="text-red text-center mt-2">{{ error }}</p>
  </v-form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

const emit = defineEmits(["auditLaunched"]);

const url = ref("");
const loading = ref(false);
const error = ref(null);
const router = useRouter();

const normalizeUrl = (inputUrl) => {
  let u = inputUrl.trim();
  if (!u.startsWith("http")) {
    u = "https://" + u;
  }
  return u;
};

const handleAudit = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  if (!url.value.trim()) {
    error.value = "L'URL ne peut pas être vide.";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const formattedUrl = normalizeUrl(url.value);

    const res = await api.post(
      "/audit",
      { url: formattedUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const auditWithDate = {
      ...res.data,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("lastAudit", JSON.stringify(auditWithDate));
    router.push({ name: "DashboardAudit", query: { site: formattedUrl } });

    emit("auditLaunched", formattedUrl);
  } catch (err) {
    error.value =
      err.response?.data?.error ||
      "Erreur lors de l'audit. Vérifie l'URL ou réessaye plus tard.";
    console.error("Erreur audit :", err);
  } finally {
    loading.value = false;
  }
};
</script>
