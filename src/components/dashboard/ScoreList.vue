<template>
  <v-card class="fill-height w-100 d-flex flex-column" elevation="2">
    <v-card-title class="text-subtitle-1 font-weight-bold">
      🔍 Résultats
    </v-card-title>

    <v-card-text class="mt-2">
      <v-row dense>
        <v-col
          cols="12"
          sm="6"
          class="pb-2"
          v-for="(value, key) in scores"
          :key="key"
        >
          <v-card
            :style="colorStyle(value)"
            class="pa-3 text-white"
            elevation="1"
          >
            <div class="text-subtitle-2 font-weight-medium">
              {{ iconMap[key] }} {{ labelMap[key] }}
            </div>

            <div class="text-h5 font-mono mt-2">
              {{ value }}%
              <span
                v-if="deltas[key] !== null && deltas[key] !== 0"
                :class="{
                  'text-green': deltas[key] > 0,
                  'text-red': deltas[key] < 0,
                  'text-grey': deltas[key] === 0,
                }"
                class="text-subtitle-2 ms-2"
              >
                ({{ deltas[key] > 0 ? "+" : "" }}{{ deltas[key] }}%)
              </span>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  performance: Number,
  accessibility: Number,
  bestPractices: Number,
  seo: Number,
  referenceScores: Object, // scores du 1er audit du site (optionnel)
});

const scores = computed(() => ({
  performance: props.performance,
  accessibility: props.accessibility,
  bestPractices: props.bestPractices,
  seo: props.seo,
}));

const deltas = computed(() => {
  const ref = props.referenceScores;
  if (!ref) {
    return {
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
    };
  }

  return {
    performance: props.performance - ref.performance,
    accessibility: props.accessibility - ref.accessibility,
    bestPractices: props.bestPractices - ref.bestPractices,
    seo: props.seo - ref.seo,
  };
});

const iconMap = {
  performance: "🚀",
  accessibility: "♿",
  bestPractices: "🔒",
  seo: "📈",
};

const labelMap = {
  performance: "Performance",
  accessibility: "Accessibilité",
  bestPractices: "Bonnes pratiques",
  seo: "SEO",
};

const colorStyle = (score) => {
  if (score >= 90) return { borderLeft: "6px solid limegreen" };
  if (score >= 60) return { borderLeft: "6px solid orange" };
  return { borderLeft: "6px solid crimson" };
};
</script>
