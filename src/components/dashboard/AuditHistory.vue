<template>
  <v-card class="pa-4 text-white" color="grey-darken-4" elevation="4">
    <div v-if="pastAudits.length || referenceAudit">
      <h3 class="text-subtitle-1 mb-2">🕘 Audits précédents</h3>
      <v-btn
        class="mb-4 text-white text-uppercase font-weight-bold"
        @click="$emit('relaunch')"
        :loading="isReloading"
        block
        color="primary"
        variant="elevated"
        rounded="lg"
      >
        <v-icon start>mdi-reload</v-icon>
        Relancer l’audit
      </v-btn>

      <!-- 📌 Audit de référence -->
      <v-card class="mb-4 pa-3 bg-grey-darken-2 text-white" elevation="1">
        <div class="d-flex justify-space-between align-center mb-2">
          <div>
            <div class="text-subtitle-2 font-weight-bold">
              📌 Audit de référence
            </div>
            <div class="text-caption">
              Effectué le {{ formatDate(referenceAudit?.createdAt) }}
            </div>
          </div>
          <v-icon color="grey-lighten-1">mdi-lock</v-icon>
        </div>

        <div class="text-caption text-grey-lighten-1 mt-1">
          Cet audit est utilisé comme point de comparaison pour mesurer vos
          améliorations. Il s’agit du tout premier test effectué sur ce site.
        </div>
      </v-card>

      <!-- 📝 Audits suivants -->
      <v-list class="bg-transparent">
        <v-list-item
          v-for="a in pastAudits"
          :key="a._id"
          :active="a._id === currentAuditId"
          @click="$emit('select', a)"
          rounded
          class="px-3"
        >
          <v-list-item-title>{{ formatDate(a.createdAt) }}</v-list-item-title>
          <v-list-item-subtitle v-if="a._id === lastAuditId">
            plus récent
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  referenceAudit: Object,
  pastAudits: Array,
  currentAuditId: String,
  lastAuditId: String,
  isReloading: Boolean,
});

const emit = defineEmits(["select", "relaunch"]);

const formatDate = (iso) => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
