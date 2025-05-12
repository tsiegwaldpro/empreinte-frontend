// src/composables/useRecoStorage.js
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";

const state = reactive({
  recoStatus: {}, // Structure : { '<site>': { '<group>': Set([...ids]) } }
});

export function useRecoStorage() {
  const route = useRoute();
  const site = computed(() => route.query.site || "default");

  const ensureGroup = (group) => {
    if (!state.recoStatus[site.value]) {
      state.recoStatus[site.value] = {};
    }
    if (!state.recoStatus[site.value][group]) {
      const key = `doneRecos-${site.value}-${group}`;
      const raw = localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : [];
      state.recoStatus[site.value][group] = new Set(stored);
    }
  };

  const isRecoDone = (group, id) => {
    ensureGroup(group);
    return state.recoStatus[site.value][group].has(id);
  };

  const toggleReco = (group, id) => {
    ensureGroup(group);
    const set = state.recoStatus[site.value][group];
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    persist(group);
  };

  const persist = (group) => {
    const key = `doneRecos-${site.value}-${group}`;
    const set = state.recoStatus[site.value][group];
    localStorage.setItem(key, JSON.stringify([...set]));
  };

  const getDoneIds = (group) => {
    ensureGroup(group);
    return state.recoStatus[site.value][group];
  };

  return {
    isRecoDone,
    toggleReco,
    getDoneIds,
  };
}
