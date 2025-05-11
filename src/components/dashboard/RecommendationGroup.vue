<template>
  <v-expansion-panels v-model="openPanel" flat multiple>
    <v-expansion-panel>
      <v-expansion-panel-title>
        {{ group }} — {{ done }} / {{ total }}
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-list lines="two" class="bg-transparent">
          <v-list-item
            v-for="(r, i) in filteredRecs"
            :key="i"
            class="reco-item"
            :class="{ 'reco-done': isRecoDone(r.id) }"
          >
            <!-- ✅ Mode compact -->
            <template v-if="isRecoDone(r.id)">
              <div class="d-flex align-center">
                <v-checkbox
                  :model-value="true"
                  @change="toggleRecoDone(r.id)"
                  hide-details
                  class="me-2"
                />
                <div class="text-body-2 text-green">✔ {{ r.title }}</div>
              </div>
            </template>

            <!-- 📝 Mode détaillé -->
            <template v-else>
              <div class="d-flex align-center mb-1">
                <v-checkbox
                  :model-value="false"
                  @change="toggleRecoDone(r.id)"
                  hide-details
                  class="me-2"
                />
                <div class="text-body-1 font-weight-medium">
                  {{ r.title }}
                </div>
                <v-chip
                  v-if="r.impactLevel === '💥'"
                  size="small"
                  color="red"
                  class="ms-2"
                >
                  Prioritaire
                </v-chip>
              </div>

              <div
                class="d-flex justify-space-between text-caption text-grey mb-2"
              >
                <span>
                  Criticité :
                  {{
                    r.impactLevel === "💥"
                      ? "💥 Critique"
                      : r.impactLevel === "⚠️"
                      ? "⚠️ Moyenne"
                      : "🟢 Faible"
                  }}
                </span>
                <span> 🎯 {{ r.impact || 0 }}/100 </span>
              </div>

              <div class="text-grey-lighten-1 mb-2">
                <em>{{ r.description }}</em>
              </div>

              <div v-if="r.displayValue" class="text-teal mb-2">
                💡 {{ r.displayValue }}
              </div>

              <div v-if="r.actions?.length">
                <h4 class="text-subtitle-2 mb-1">🛠 Actions concrètes</h4>
                <v-list-item
                  v-for="(a, j) in r.actions"
                  :key="j"
                  class="bg-grey-darken-4 rounded-sm my-2"
                >
                  <v-list-item-title>{{ a.label }}</v-list-item-title>
                  <v-list-item-subtitle v-if="a.code">
                    <pre><code>{{ a.code }}</code></pre>
                  </v-list-item-subtitle>
                </v-list-item>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  group: String,
  recs: Array,
  selectedImpact: String,
});

const openPanel = ref([0]);

const site =
  new URLSearchParams(window.location.search).get("site") || "default";
const localKey = `group-open-${site}-${props.group}`;

// Persist état ouvert
onMounted(() => {
  if (localStorage.getItem(localKey) === "false") openPanel.value = [];
});

watch(openPanel, (val) => {
  localStorage.setItem(localKey, val.length ? "true" : "false");
});

// Gestion des reco faites
const doneRecos = ref([]);
const loadDoneRecos = () => {
  const raw = localStorage.getItem("doneRecos");
  const data = raw ? JSON.parse(raw) : {};
  doneRecos.value = data[site] || [];
};
loadDoneRecos();

const isRecoDone = (id) => doneRecos.value.includes(id);

const toggleRecoDone = (id) => {
  const newSet = new Set(doneRecos.value);
  newSet.has(id) ? newSet.delete(id) : newSet.add(id);
  doneRecos.value = Array.from(newSet);

  const raw = localStorage.getItem("doneRecos");
  const data = raw ? JSON.parse(raw) : {};
  data[site] = doneRecos.value;
  localStorage.setItem("doneRecos", JSON.stringify(data));
};

const filteredRecs = computed(() =>
  !props.selectedImpact
    ? props.recs
    : props.recs.filter((r) => r.impactLevel === props.selectedImpact)
);

const total = computed(() => props.recs.length);
const done = computed(() => props.recs.filter((r) => isRecoDone(r.id)).length);
</script>

<style scoped>
.reco-item {
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}
.reco-done {
  opacity: 0.5;
}
</style>
