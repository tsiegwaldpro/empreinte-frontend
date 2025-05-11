<template>
  <v-card
    class="fill-height w-100 d-flex flex-column justify-space-between"
    elevation="2"
  >
    <v-card-title class="text-subtitle-1 font-weight-bold">
      🔎 Filtres
    </v-card-title>

    <v-card-text class="d-flex flex-column gap-4">
      <!-- Groupes -->
      <div>
        <div class="text-caption text-grey-lighten-1 mb-1">📁 Par groupe</div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="group in groups"
            :key="group"
            :color="selectedGroup === group ? 'primary' : 'grey-darken-3'"
            class="text-white"
            size="small"
            variant="flat"
            filter
            @click="$emit('update:selectedGroup', group)"
          >
            {{ group }} ({{ groupCounts[group] || 0 }})
          </v-chip>
        </div>
      </div>

      <!-- Criticité -->
      <div>
        <div class="text-caption text-grey-lighten-1 mb-1">
          💥 Par criticité
        </div>
        <div class="d-flex flex-wrap gap-2">
          <v-chip
            v-for="impact in levels"
            :key="impact.icon"
            :color="
              selectedImpact === impact.icon ? 'primary' : 'grey-darken-3'
            "
            class="text-white"
            size="small"
            variant="flat"
            filter
            @click="$emit('update:selectedImpact', impact.icon)"
          >
            {{ impact.icon }} {{ impact.label }} ({{
              impactCounts[impact.icon] || 0
            }})
          </v-chip>
        </div>
      </div>
    </v-card-text>

    <v-card-actions
      v-if="selectedGroup || selectedImpact"
      class="justify-center"
    >
      <v-btn
        variant="text"
        size="small"
        color="grey-lighten-1"
        @click="resetAll"
      >
        ❌ Réinitialiser les filtres
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  groups: Array,
  groupCounts: Object,
  impactCounts: Object,
  levels: Array,
  selectedGroup: String,
  selectedImpact: String,
});

const emit = defineEmits(["update:selectedGroup", "update:selectedImpact"]);

const resetAll = () => {
  emit("update:selectedGroup", null);
  emit("update:selectedImpact", null);
};
</script>
