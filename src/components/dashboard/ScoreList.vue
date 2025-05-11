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
            <div class="text-h5 font-mono mt-2">{{ value }}%</div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  performance: Number,
  accessibility: Number,
  bestPractices: Number,
  seo: Number,
});

const scores = {
  performance: props.performance,
  accessibility: props.accessibility,
  bestPractices: props.bestPractices,
  seo: props.seo,
};

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
