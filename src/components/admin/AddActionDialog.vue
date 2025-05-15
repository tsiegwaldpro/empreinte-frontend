<template>
  <v-dialog v-model="model" max-width="600px">
    <v-card>
      <v-card-title>
        Ajouter une action à <strong>{{ reco?.title }}</strong>
      </v-card-title>

      <v-card-text>
        <v-text-field
          label="Label de l'action"
          v-model="label"
          required
          :rules="[(v) => !!v || 'Le label est requis']"
        />
        <v-textarea
          label="Code / Description détaillée (optionnel)"
          v-model="code"
          rows="4"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Annuler</v-btn>
        <v-btn color="primary" @click="submit">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: Boolean,
  reco: Object,
});
const emit = defineEmits(["update:modelValue", "submit"]);

const label = ref("");
const code = ref("");

const model = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => (model.value = val)
);
watch(model, (val) => emit("update:modelValue", val));

function close() {
  model.value = false;
}
function submit() {
  if (!label.value.trim()) return alert("Le label est requis");
  emit("submit", { label: label.value.trim(), code: code.value.trim() });
  close();
}
</script>
