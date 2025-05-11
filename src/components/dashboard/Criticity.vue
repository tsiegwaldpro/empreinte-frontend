<template>
  <v-card class="criticity-card" elevation="2">
    <v-card-title class="text-subtitle-1 font-weight-bold"
      >🔥 Criticité</v-card-title
    >

    <v-list density="compact" class="text-white">
      <v-list-item
        v-for="impact in levels"
        :key="impact.icon"
        :active="modelValue === impact.icon"
        @click="$emit('update:modelValue', impact.icon)"
        class="criticity-item"
      >
        <v-list-item-title>
          {{ impact.icon }} {{ impact.label }} ({{ count[impact.icon] || 0 }})
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
  levels: Array,
  count: Object,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.criticity-card {
  background-color: #1e1e1e;
  border-radius: 12px;
}
.criticity-item {
  cursor: pointer;
  border-radius: 8px;
}
</style>
