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
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <p v-if="error" class="text-red text-center">{{ error }}</p>
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

const handleAudit = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    let formattedUrl = url.value.trim();
    if (!formattedUrl.startsWith("http")) {
      formattedUrl = "https://" + formattedUrl;
    }

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
    error.value = "Erreur lors de l'audit. Vérifie l'URL.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>
