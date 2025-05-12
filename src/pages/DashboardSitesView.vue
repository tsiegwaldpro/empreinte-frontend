<template>
  <div>
    <h1 class="text-h5 font-weight-bold mb-4">🌐 Vos sites audités</h1>

    <section class="mb-10">
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
      </v-form>

      <p v-if="error" class="text-red text-center">{{ error }}</p>
    </section>

    <v-row class="mb-6">
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="1">
          <div class="text-h6">{{ totalAudits }}</div>
          <div class="text-caption text-grey">Audits réalisés</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="1">
          <div class="text-h6">{{ totalSites }}</div>
          <div class="text-caption text-grey">Sites différents</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="1">
          <div class="text-h6">{{ latestAuditDate }}</div>
          <div class="text-caption text-grey">Dernier audit</div>
        </v-card>
      </v-col>
    </v-row>

    <v-alert v-if="!sites.length" type="info" variant="tonal">
      Aucun audit trouvé pour l’instant.
    </v-alert>

    <v-list v-else two-line>
      <v-list-item
        v-for="site in sites"
        :key="site.url"
        @click="goToLastAudit(site.url)"
        class="mb-2 rounded"
        color="primary"
        style="cursor: pointer"
      >
        <v-list-item-title class="text-white">{{ site.url }}</v-list-item-title>
        <v-list-item-subtitle class="text-grey-lighten-1">
          {{ site.count }} audit(s)
        </v-list-item-subtitle>

        <v-list-item-action>
          <v-icon color="white">mdi-chevron-right</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/api"; // ✅ instance centralisée

const sites = ref([]);
const totalAudits = ref(0);
const totalSites = ref(0);
const latestAuditDate = ref("-");

const url = ref("");
const loading = ref(false);
const error = ref(null);

const router = useRouter();

const handleAudit = async () => {
  console.log("Audit déclenché avec :", url.value);
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
      "/api/audit",
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
  } catch (err) {
    error.value = "Erreur lors de l'audit. Vérifie l'URL.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    const resGrouped = await api.get("/api/grouped", { headers });
    sites.value = resGrouped.data;
    totalSites.value = sites.value.length;
    totalAudits.value = sites.value.reduce((acc, s) => acc + s.count, 0);

    const resAll = await api.get("/api/history", { headers });
    const audits = resAll.data;
    if (audits.length > 0) {
      const latest = new Date(audits[0].createdAt);
      latestAuditDate.value = latest.toLocaleDateString();
    }
  } catch (err) {
    console.error("Erreur lors du chargement des données dashboard :", err);
  }
});

const goToLastAudit = (url) => {
  router.push({ name: "DashboardAudit", query: { site: url } });
};
</script>
