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
    const doneIds = getDoneIds(key);
    const done = catRecs.filter((r) => doneIds.has(r.id)).length;

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
