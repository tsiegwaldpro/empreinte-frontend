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
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  sites: {
    type: Array,
    required: true,
  },
});

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

const goTo = (url) => {
  router.push({ name: "DashboardAudit", query: { site: url } });
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
