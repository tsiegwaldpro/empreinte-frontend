<template>
  <v-container class="py-8">
    <v-card elevation="2" class="pa-4 mb-6 bg-grey-darken-3">
      <v-card-title class="text-h5 font-weight-bold">
        🌐 Historique de vos audits
      </v-card-title>
      <v-card-subtitle class="text-body-1 text-grey-lighten-1">
        Retrouvez ici tous les audits réalisés, tous sites confondus.
      </v-card-subtitle>
    </v-card>

    <v-data-table
      :headers="headers"
      :items="computedAudits"
      :sort-by="sortBy"
      class="elevation-1 bg-grey-darken-4 text-white"
      item-value="_id"
      dense
    >
      <template #item.url="{ item }">
        {{ extractDomain(item.url) }}
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

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon
          variant="text"
          size="small"
          @click="goToAudit(item)"
          title="Voir l’audit"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="text"
          size="small"
          color="error"
          @click="confirmDelete(item)"
          title="Supprimer cet audit"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Dialog de confirmation suppression -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmation</v-card-title>
        <v-card-text>
          Supprimer l’audit du site
          <strong>{{ extractDomain(auditToDelete?.url) }}</strong> du
          {{ formatDate(auditToDelete?.createdAt) }}&nbsp;?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Annuler</v-btn>
          <v-btn text color="error" @click="deleteAudit">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";

const audits = ref([]);
const dialog = ref(false);
const auditToDelete = ref(null);
const sortBy = ref([{ key: "createdAt", order: "desc" }]);
const router = useRouter();

const headers = [
  { title: "Domaine", key: "url", sortable: true },
  { title: "🚀 Perf.", key: "performance", sortable: true },
  { title: "♿ Access.", key: "accessibility", sortable: true },
  { title: "🔒 Pratiques", key: "bestPractices", sortable: true },
  { title: "📈 SEO", key: "seo", sortable: true },
  { title: "Dernier audit", key: "createdAt", sortable: true },
  { title: "", key: "actions", sortable: false },
];

const fetchAudits = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/audit/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    audits.value = res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (err) {
    console.error("Erreur lors du chargement des audits:", err);
  }
};
onMounted(fetchAudits);

const computedAudits = computed(() =>
  audits.value.map((audit) => ({
    ...audit,
    performance: audit.performance ?? -1,
    accessibility: audit.accessibility ?? -1,
    bestPractices: audit.bestPractices ?? -1,
    seo: audit.seo ?? -1,
    createdAt: audit.createdAt ?? "",
  }))
);

function goToAudit(audit) {
  router.push({
    path: "/dashboard/audit",
    query: { site: audit.url, id: audit._id },
  });
}

function confirmDelete(audit) {
  auditToDelete.value = audit;
  dialog.value = true;
}

async function deleteAudit() {
  if (!auditToDelete.value) return;
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/audit/${auditToDelete.value._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    audits.value = audits.value.filter(
      (a) => a._id !== auditToDelete.value._id
    );
    dialog.value = false;
  } catch (err) {
    alert("Erreur lors de la suppression");
    console.error(err);
  }
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return url;
  }
}
function display(val) {
  return val == null || val === -1 ? "—" : `${val}%`;
}
function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function getColor(val) {
  if (val == null || val === -1) return "text-grey-lighten-1";
  if (val >= 90) return "text-green font-weight-medium";
  if (val >= 50) return "text-orange font-weight-medium";
  return "text-red font-weight-medium";
}
</script>
