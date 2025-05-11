<template>
  <v-card
    class="fill-height w-100 d-flex flex-column justify-space-between"
    elevation="2"
  >
    <v-card-title class="text-subtitle-1 font-weight-bold">
      🔎 Filtres
    </v-card-title>

    <v-card-text class="d-flex flex-wrap gap-2">
      <v-chip
        v-for="group in groups"
        :key="group"
        :color="modelValue === group ? 'primary' : 'grey-darken-3'"
        class="text-white"
        @click="$emit('update:modelValue', group)"
        size="small"
        variant="flat"
        filter
      >
        {{ group }} ({{ count[group] || 0 }})
      </v-chip>
    </v-card-text>

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
