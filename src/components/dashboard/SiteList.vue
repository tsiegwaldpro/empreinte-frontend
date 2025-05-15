<template>
  <v-alert v-if="!sites.length" type="info" variant="tonal">
    Aucun audit trouvé pour l’instant.
  </v-alert>

  <v-data-table
    v-else
    :items="computedSites"
    :headers="headers"
    v-model:sort-by="sortBy"
    class="elevation-1 bg-grey-darken-4 text-white"
    item-value="url"
    dense
  >
    <template #item.url="{ item }">
      {{ getDomainName(item.url) }}
    </template>

    <template #item.performance="{ item }">
      <span :class="getColor(item.performance)">
        {{ display(item.performance) }}
      </span>
    </template>

    <template #item.accessibility="{ item }">
      <span :class="getColor(item.accessibility)">
        {{ display(item.accessibility) }}
      </span>
    </template>

    <template #item.bestPractices="{ item }">
      <span :class="getColor(item.bestPractices)">
        {{ display(item.bestPractices) }}
      </span>
    </template>

    <template #item.seo="{ item }">
      <span :class="getColor(item.seo)">
        {{ display(item.seo) }}
      </span>
    </template>

    <template #item.count="{ item }">
      {{ item.count }}
    </template>

    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <template #item.actions="{ item }">
      <v-btn
        icon
        variant="text"
        size="small"
        @click="goTo(item.url)"
        title="Voir l’audit"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>

      <v-btn
        icon
        variant="text"
        size="small"
        color="error"
        @click="confirmDelete(item.url)"
        title="Supprimer tous les audits de ce site"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>

  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h6">Confirmation</v-card-title>
      <v-card-text>
        Êtes-vous sûr de vouloir supprimer
        <strong>{{ siteToDelete }}</strong> et tous ses audits ?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="dialog = false">Annuler</v-btn>
        <v-btn text color="error" @click="deleteSiteAudits">Supprimer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/api"; // ton instance axios ou équivalent

const props = defineProps({
  sites: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["refresh"]);

const sortBy = ref([{ key: "createdAt", order: "desc" }]);

const computedSites = computed(() =>
  props.sites.map((site) => ({
    ...site,
    performance: site.lastAudit?.scores?.performance ?? -1,
    accessibility: site.lastAudit?.scores?.accessibility ?? -1,
    bestPractices: site.lastAudit?.scores?.bestPractices ?? -1,
    seo: site.lastAudit?.scores?.seo ?? -1,
    createdAt: site.lastAudit?.createdAt ?? "",
  }))
);

const router = useRouter();

const dialog = ref(false);
const siteToDelete = ref("");

const goTo = (url) => {
  router.push({ name: "DashboardAudit", query: { site: url } });
};

const confirmDelete = (url) => {
  siteToDelete.value = url;
  dialog.value = true;
};

const deleteSiteAudits = async () => {
  dialog.value = false;
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/audits/site`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { site: siteToDelete.value },
    });
    emit("refresh");
  } catch (error) {
    console.error("Erreur suppression audits :", error);
    alert("Erreur lors de la suppression, regarde la console.");
  }
};

const headers = [
  { title: "Domaine", key: "url", sortable: true },
  { title: "🚀 Perf.", key: "performance", sortable: true },
  { title: "♿ Access.", key: "accessibility", sortable: true },
  { title: "🔒 Pratiques", key: "bestPractices", sortable: true },
  { title: "📈 SEO", key: "seo", sortable: true },
  { title: "Audits", key: "count", sortable: true },
  { title: "Dernier audit", key: "createdAt", sortable: true },
  { title: "", key: "actions", sortable: false },
];

const display = (score) => {
  return score !== undefined && score !== -1 ? score + "%" : "--%";
};

const getColor = (score) => {
  if (score === undefined || score === -1) return "text-grey-lighten-1";
  if (score >= 90) return "text-green font-weight-medium";
  if (score >= 50) return "text-orange font-weight-medium";
  return "text-red font-weight-medium";
};

const getDomainName = (url) => {
  try {
    const cleanUrl = url.startsWith("http") ? url : "http://" + url;
    const { hostname } = new URL(cleanUrl);
    return hostname.replace(/^www\\./, "");
  } catch {
    return url;
  }
};

const formatDate = (isoString) => {
  if (!isoString) return "--";
  return new Date(isoString).toLocaleDateString();
};
</script>
