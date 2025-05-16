<template>
  <div>
    <!-- Mode résumé : chips cliquables -->
    <div v-if="!detail" class="mt-2 d-flex flex-wrap gap-2">
      <v-chip
        v-for="(action, idx) in actions"
        :key="idx"
        small
        class="text-white"
      >
        {{ action.label }}
        <v-icon
          right
          small
          class="ml-1"
          @click.stop="() => emitEdit(idx)"
          title="Modifier l'action"
          >mdi-pencil</v-icon
        >
        <v-icon
          right
          small
          class="ml-1"
          @click.stop="() => emitDelete(idx)"
          title="Supprimer l'action"
          >mdi-delete</v-icon
        >
      </v-chip>
    </div>

    <!-- Mode détaillé : liste avec code -->
    <div v-else class="d-flex flex-column gap-4 mt-4">
      <div
        v-for="(action, idx) in actions"
        :key="idx"
        class="pa-4 bg-grey-darken-3 rounded d-flex flex-column"
      >
        <div class="d-flex justify-space-between align-start mb-2">
          <h4 class="text-subtitle-1 font-weight-bold mb-1 text-white">
            {{ action.label }}
          </h4>
          <div class="d-flex gap-2">
            <v-btn
              icon
              size="small"
              color="primary"
              variant="text"
              @click="emitEdit(idx)"
              title="Modifier l'action"
            >
              <v-icon size="20">mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              color="red"
              variant="text"
              @click="emitDelete(idx)"
              title="Supprimer l'action"
            >
              <v-icon size="20">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>

        <div
          v-if="action.code"
          class="text-grey-lighten-2 text-caption"
          style="
            white-space: pre-wrap;
            background-color: #1f1f1f;
            padding: 12px;
            border-radius: 4px;
          "
        >
          {{ action.code }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";

const props = defineProps({
  actions: {
    type: Array,
    required: true,
  },
  detail: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["edit", "delete"]);

function emitEdit(index) {
  emit("edit", index);
}

function emitDelete(index) {
  emit("delete", index);
}
</script>

<style scoped>
.bg-grey-darken-3 {
  background-color: #242424;
}
</style>
