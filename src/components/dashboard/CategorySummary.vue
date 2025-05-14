<template>
  <v-card class="pa-4 mb-6 text-white" color="grey-darken-4" elevation="4">
    <v-row dense class="category-summary">
      <v-col v-for="cat in categories" :key="cat.key" cols="12" sm="6" md="3">
        <v-card
          class="text-center"
          :style="{ backgroundColor: cat.color }"
          flat
        >
          <v-card-title class="text-subtitle-1 font-weight-bold">
            {{ cat.label }}
          </v-card-title>
          <v-card-text class="text-h6 font-mono">
            {{ cat.done }} / {{ cat.total }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useRecoStorage } from "@/composables/useRecoStorage";

const props = defineProps({
  recommendations: Array,
});

const { getDoneIds } = useRecoStorage();

const groupLabels = {
  performance: "Performances",
  accessibility: "Accessibilité",
  seo: "SEO",
  "best-practices": "Bonnes pratiques",
};

const colorMap = {
  performance: "#FFB3A7",
  accessibility: "#A7D0F2",
  seo: "#FFE59D",
  "best-practices": "#C1F0DC",
};

const normalizeGroup = (key) =>
  key?.toLowerCase().replace(/\s+/g, "-") || "general";

const getLabel = (key) => groupLabels[normalizeGroup(key)] || key;
const getColor = (key) => colorMap[normalizeGroup(key)] || "#ccc";

const categories = computed(() => {
  if (!props.recommendations) return [];

  const groups = [...new Set(props.recommendations.map((r) => r.group))];

  return groups.map((key) => {
    const normKey = normalizeGroup(key);
    const catRecs = props.recommendations.filter(
      (r) => normalizeGroup(r.group) === normKey
    );
    const done = catRecs.filter((r) =>
      getDoneIds(normKey).value.has(r.id)
    ).length;

    return {
      key: normKey,
      label: getLabel(key),
      color: getColor(key),
      done,
      total: catRecs.length,
    };
  });
});
</script>
