<template>
  <v-card class="score-card" elevation="2">
    <v-card-title class="text-subtitle-1 font-weight-bold"
      >🔍 Résultats</v-card-title
    >

    <v-card-text class="d-flex flex-column gap-3">
      <div
        v-for="(value, key) in scores"
        :key="key"
        class="score-line"
        :style="colorStyle(value)"
      >
        <span>{{ iconMap[key] }} {{ labelMap[key] }} : {{ value }}%</span>
      </div>
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
  if (score >= 90)
    return { borderLeft: "6px solid limegreen", paddingLeft: "8px" };
  if (score >= 60)
    return { borderLeft: "6px solid orange", paddingLeft: "8px" };
  return { borderLeft: "6px solid crimson", paddingLeft: "8px" };
};
</script>

<style scoped>
.score-card {
  background-color: #1e1e1e;
  border-radius: 12px;
}
.score-line {
  font-size: 1rem;
  color: #eee;
}
</style>
