// src/composables/useRecoStorage.js
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";

const state = reactive({
  recoStatus: {}, // Structure : { '<site>': { '<group>': Set([...ids]) } }
});

export function useRecoStorage() {
  const route = useRoute();
  const site = computed(() => route.query.site || "default");

  const normalizeGroup = (key) =>
    key?.toLowerCase().replace(/\s+/g, "-") || "general";

  const ensureGroup = (group) => {
    const normGroup = normalizeGroup(group);
    if (!state.recoStatus[site.value]) {
      state.recoStatus[site.value] = {};
    }
    if (!state.recoStatus[site.value][normGroup]) {
      const key = `doneRecos-${site.value}-${normGroup}`;
      const raw = localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : [];
      state.recoStatus[site.value][normGroup] = new Set(stored);
    }
  };

  const isRecoDone = (group, id) => {
    const normGroup = normalizeGroup(group);
    ensureGroup(normGroup);
    return state.recoStatus[site.value][normGroup].has(id);
  };

  const toggleReco = (group, id) => {
    const normGroup = normalizeGroup(group);
    ensureGroup(normGroup);
    const set = state.recoStatus[site.value][normGroup];
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    persist(normGroup);
  };

  const persist = (group) => {
    const normGroup = normalizeGroup(group);
    const key = `doneRecos-${site.value}-${normGroup}`;
    const set = state.recoStatus[site.value][normGroup];
    localStorage.setItem(key, JSON.stringify([...set]));
  };

  const getDoneIds = (group) => {
    const normGroup = normalizeGroup(group);
    ensureGroup(normGroup);
    return computed(() => state.recoStatus[site.value][normGroup]);
  };

  return {
    isRecoDone,
    toggleReco,
    getDoneIds,
  };
}
