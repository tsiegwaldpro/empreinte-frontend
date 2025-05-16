<template>
  <v-list-item :class="{ 'reco-done': isDone }" class="reco-card mb-4">
    <!-- ✅ Case à cocher -->
    <div class="d-flex align-center mb-1">
      <v-checkbox
        :model-value="isDone"
        @change="toggleDone"
        hide-details
        density="compact"
        class="me-2"
        color="primary"
        :ripple="false"
      />
      <div class="text-body-1 font-weight-medium">{{ reco.title }}</div>
      <v-chip
        v-if="reco.impactLevel === '💥'"
        size="small"
        color="red"
        class="ms-2"
        >Prioritaire</v-chip
      >
    </div>

    <!-- Criticité & Score -->
    <div class="d-flex justify-space-between text-caption text-grey mb-2">
      <span>
        Criticité :
        {{
          reco.impactLevel === "💥"
            ? "💥 Critique"
            : reco.impactLevel === "⚠️"
            ? "⚠️ Moyenne"
            : "🟢 Faible"
        }}
      </span>
      <span> 🎯 {{ reco.impact || 0 }}/100 </span>
    </div>

    <div class="text-grey-lighten-1 mb-2">
      <em>{{ reco.description }}</em>
    </div>
    <div v-if="reco.displayValue" class="text-teal mb-2">
      💡 {{ reco.displayValue }}
    </div>

    <!-- CONSEILS (généraux/advice) -->
    <div v-if="reco.advice && reco.advice.length">
      <h4 class="text-subtitle-2 mb-1">💡 Conseils</h4>
      <ul style="padding-left: 1.2em">
        <li v-for="(adv, idx) in reco.advice" :key="idx" class="mb-2">
          <strong>{{ adv.label }}</strong>
          <div
            v-if="adv.code"
            class="text-grey-lighten-2"
            style="font-size: 0.95em"
          >
            {{ adv.code }}
          </div>
        </li>
      </ul>
    </div>

    <!-- ACTIONS CONCRÈTES -->
    <div v-if="reco.actions?.length">
      <h4 class="text-subtitle-2 mb-1">🛠 Actions concrètes</h4>
      <v-list-item
        v-for="(a, j) in reco.actions"
        :key="j"
        class="action-item bg-grey-darken-4 rounded-sm my-2 p-2"
      >
        <v-list-item-title>{{ a.label }}</v-list-item-title>
        <v-list-item-subtitle v-if="a.code">
          <pre class="action-code"><code>{{ a.code }}</code></pre>
        </v-list-item-subtitle>
      </v-list-item>
    </div>
  </v-list-item>
</template>

<script setup>
import { computed } from "vue";
import { useRecoStorage } from "@/composables/useRecoStorage";

// Props
const props = defineProps({
  reco: { type: Object, required: true },
  group: { type: String, required: true },
});
const emit = defineEmits(["toggleDone"]);

// Gestion done (coché)
const { isRecoDone, toggleReco } = useRecoStorage();
const isDone = computed(() => isRecoDone(props.group, props.reco.id));
const toggleDone = () => {
  toggleReco(props.group, props.reco.id);
  emit("toggleDone", props.reco.id);
};
</script>

<style scoped>
.reco-card {
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.reco-done {
  opacity: 0.5;
}
.action-item {
  overflow: visible !important;
}
.action-code {
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: none;
  background-color: #1f1f1f;
  padding: 12px;
  border-radius: 4px;
}
</style>
