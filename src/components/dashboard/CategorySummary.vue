<template>
  <v-row dense class="category-summary mb-6">
    <v-col v-for="cat in categories" :key="cat.key" cols="12" sm="6" md="3">
      <v-card
        class="text-center"
        :style="{ backgroundColor: cat.color }"
        elevation="4"
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
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  recommendations: Array,
  doneRecos: Object,
});

const colorMap = {
  "Best Practices": "#C1F0DC",
  Performance: "#FFB3A7",
  Accessibility: "#A7D0F2",
  SEO: "#FFE59D",
};

const categories = computed(() => {
  if (!props.recommendations) return [];

  const groups = [...new Set(props.recommendations.map((r) => r.group))];

  return groups.map((key) => {
    const catRecs = props.recommendations.filter((r) => r.group === key);
    const done = catRecs.filter((r) => props.doneRecos?.has(r.id)).length;

    return {
      key,
      label: key,
      color: colorMap[key] || "#ccc",
      done,
      total: catRecs.length,
    };
  });
});
</script>
