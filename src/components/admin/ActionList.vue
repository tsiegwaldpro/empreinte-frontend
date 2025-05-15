<template>
  <div v-if="actions?.length">
    <h4 class="text-subtitle-1 mb-2 text-white">🛠 Actions concrètes :</h4>
    <v-list dense>
      <v-list-item
        v-for="(action, idx) in actions"
        :key="idx"
        class="bg-grey-darken-3 rounded-sm mb-2"
      >
        <v-list-item-content>
          <v-list-item-title class="text-white">{{
            action.label
          }}</v-list-item-title>
          <v-list-item-subtitle v-if="action.code" class="text-grey-lighten-2">
            <pre style="margin: 0; white-space: pre-wrap">{{
              action.code
            }}</pre>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            icon
            color="red"
            @click="$emit('delete', idx)"
            title="Supprimer l'action"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
defineProps({ actions: Array });
defineEmits(["delete"]);
</script>
