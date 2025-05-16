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

    <!-- ACTIONS CONCRÈTES REGROUPÉES -->
    <div v-if="reco.actions?.length">
      <h4 class="text-subtitle-2 mb-1">
        🛠 Actions concrètes
        <span v-if="reco.actions.length > 3" class="text-grey-lighten-2 ms-2">
          ({{ reco.actions.length }} actions)
        </span>
      </h4>

      <!-- Affichage direct si 4 actions ou moins -->
      <div v-if="reco.actions.length <= 4">
        <v-list density="compact" class="bg-transparent px-0">
          <v-list-item
            v-for="(group, j) in groupedActions"
            :key="j"
            class="action-item bg-grey-darken-4 rounded-sm my-2 p-2"
          >
            <v-list-item-title class="font-weight-bold mb-2">
              {{ group.baseLabel }}
            </v-list-item-title>
            <!-- Liste fichiers/URLs regroupées -->
            <ul class="action-file-list" v-if="group.codes.length">
              <li v-for="(code, idx) in group.codes" :key="idx">
                <span class="file-label">{{ code.file }}</span>
                <br v-if="code.url" />
                <code v-if="code.url" class="action-url">{{ code.url }}</code>
              </li>
            </ul>
            <!-- Actions orphelines (pas groupées) -->
            <div
              v-for="(act, idx) in group.actions"
              :key="'solo-' + idx"
              class="mt-2"
            >
              <span>{{ act.label }}</span>
              <div
                v-if="act.code"
                class="text-grey-lighten-2"
                style="font-size: 0.95em"
              >
                <pre class="action-code"><code>{{ act.code }}</code></pre>
              </div>
            </div>
          </v-list-item>
        </v-list>
      </div>
      <!-- Accordéon si plus de 4 actions -->
      <div v-else>
        <v-expansion-panels v-model="actionsOpen" multiple>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <span class="text-body-2">
                Voir la liste des actions à réaliser ({{ reco.actions.length }})
              </span>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list density="compact" class="bg-transparent px-0">
                <v-list-item
                  v-for="(group, j) in groupedActions"
                  :key="j"
                  class="action-item bg-grey-darken-4 rounded-sm my-2 p-2"
                >
                  <v-list-item-title class="font-weight-bold mb-2">
                    {{ group.baseLabel }}
                  </v-list-item-title>
                  <ul class="action-file-list" v-if="group.codes.length">
                    <li v-for="(code, idx) in group.codes" :key="idx">
                      <span class="file-label">{{ code.file }}</span>
                      <br v-if="code.url" />
                      <code v-if="code.url" class="action-url">{{
                        code.url
                      }}</code>
                    </li>
                  </ul>
                  <!-- Actions orphelines (pas groupées) -->
                  <div
                    v-for="(act, idx) in group.actions"
                    :key="'solo-' + idx"
                    class="mt-2"
                  >
                    <span>{{ act.label }}</span>
                    <div
                      v-if="act.code"
                      class="text-grey-lighten-2"
                      style="font-size: 0.95em"
                    >
                      <pre class="action-code"><code>{{ act.code }}</code></pre>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </div>
  </v-list-item>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
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

// Groupement des actions par label générique (pour éviter la répétition)
function groupActions(actions) {
  const groups = {};
  for (const action of actions) {
    let baseLabel = action.label;
    let fileLabel = null;
    const match = action.label.match(/^(.*) : (.+)$/);
    if (match) {
      baseLabel = match[1].trim();
      fileLabel = match[2].trim();
    }
    if (!groups[baseLabel]) {
      groups[baseLabel] = {
        baseLabel,
        actions: [],
        codes: [],
      };
    }
    if (fileLabel) {
      if (action.code) {
        groups[baseLabel].codes.push({
          file: fileLabel,
          url: action.code,
        });
      } else {
        groups[baseLabel].codes.push({ file: fileLabel });
      }
    } else {
      groups[baseLabel].actions.push(action);
    }
  }
  return Object.values(groups);
}

// Accordéon actions : par défaut OUVERT si <=4 actions, fermé sinon
const actionsOpen = ref([]);
watch(
  () => props.reco.actions,
  (newActions) => {
    nextTick(() => {
      if (newActions && newActions.length > 0) {
        actionsOpen.value = newActions.length <= 4 ? [0] : [];
      }
    });
  },
  { immediate: true }
);

// Nouvelle liste groupée pour affichage
const groupedActions = computed(() =>
  props.reco.actions ? groupActions(props.reco.actions) : []
);
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
.action-file-list {
  margin: 0 0 0 0.6em;
  padding: 0;
  list-style-type: disc;
}
.action-file-list li {
  margin-bottom: 6px;
  font-size: 1em;
  color: #eee;
  line-height: 1.25;
  word-break: break-all;
}
.file-label {
  font-weight: 500;
  color: #ffc107;
  font-size: 1em;
}
.action-url {
  background: #232323;
  color: #6fd2ff;
  padding: 1px 6px 1px 6px;
  font-size: 0.96em;
  border-radius: 4px;
  margin-left: 0.6em;
  display: inline-block;
  margin-top: 2px;
}
</style>
