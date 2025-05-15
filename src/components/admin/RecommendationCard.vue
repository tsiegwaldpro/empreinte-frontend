<template>
  <div class="mb-8 p-4 bg-grey-darken-4 rounded">
    <div class="d-flex justify-space-between align-center mb-2">
      <div>
        <strong class="text-h6 text-white">{{ reco.title }}</strong>
        <div class="text-caption text-grey">{{ reco.group }}</div>
      </div>
      <v-btn
        icon
        color="primary"
        @click="$emit('add-action', reco)"
        title="Ajouter une action"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <div class="mb-2 text-grey-lighten-1">{{ reco.description }}</div>

    <ActionList
      :actions="reco.actions"
      @delete="(idx) => $emit('delete-action', reco.id, idx)"
    />

    <div v-if="!reco.actions?.length" class="text-red">
      ❌ Aucune action pour cette recommandation
    </div>
  </div>
</template>

<script setup>
defineProps({
  reco: Object,
});
defineEmits(["add-action", "delete-action"]);
import ActionList from "./ActionList.vue";
</script>
