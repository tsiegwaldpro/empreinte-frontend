<template>
  <v-card class="filters-card" elevation="2" v-if="groups.length">
    <v-card-title class="text-subtitle-1 font-weight-bold"
      >🔎 Filtres</v-card-title
    >

    <v-list density="compact" class="text-white">
      <v-list-item
        v-for="group in groups"
        :key="group"
        :active="modelValue === group"
        @click="$emit('update:modelValue', group)"
        class="filter-item"
      >
        <v-list-item-title>
          {{ group }} ({{ count[group] || 0 }})
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <v-card-actions v-if="modelValue" class="justify-center">
      <v-btn
        variant="text"
        size="small"
        color="grey-lighten-1"
        @click="$emit('update:modelValue', null)"
      >
        ❌ Réinitialiser
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps({
  groups: Array,
  count: Object,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.filters-card {
  background-color: #1e1e1e;
  border-radius: 12px;
}
.filter-item {
  cursor: pointer;
  border-radius: 8px;
}
</style>
