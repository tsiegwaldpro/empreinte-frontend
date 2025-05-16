// src/composables/useRecoStorage.js
import { reactive, computed } from "vue";

const state = reactive({
  recoStatus: {}, // { '<auditId>': { '<group>': Set([...ids]) } }
});

export function useRecoStorage(auditId) {
  const normalizeGroup = (key) =>
    key?.toLowerCase().replace(/\s+/g, "-") || "general";

  const ensureGroup = (group) => {
    const normGroup = normalizeGroup(group);
    if (!state.recoStatus[auditId]) {
      state.recoStatus[auditId] = {};
    }
    if (!state.recoStatus[auditId][normGroup]) {
      const key = `doneRecos-${auditId}-${normGroup}`;
      const raw = localStorage.getItem(key);
      const stored = raw ? JSON.parse(raw) : [];
      state.recoStatus[auditId][normGroup] = new Set(stored);
    }
  };

  const isRecoDone = (group, id) => {
    const normGroup = normalizeGroup(group);
    ensureGroup(normGroup);
    return state.recoStatus[auditId][normGroup].has(id);
  };

  const toggleReco = (group, id) => {
    const normGroup = normalizeGroup(group);
    ensureGroup(normGroup);
    const set = state.recoStatus[auditId][normGroup];
    if (set.has(id)) {
      set.delete(id);
    } else {
      set.add(id);
    }
    persist(normGroup);
  };

  const persist = (group) => {
    const normGroup = normalizeGroup(group);
    const key = `doneRecos-${auditId}-${normGroup}`;
    const set = state.recoStatus[auditId][normGroup];
    localStorage.setItem(key, JSON.stringify([...set]));
  };

  const computedCache = {};
  const getDoneIds = (group) => {
    const normGroup = normalizeGroup(group);
    ensureGroup(normGroup);
    const cacheKey = `${auditId}-${normGroup}`;
    if (!computedCache[cacheKey]) {
      computedCache[cacheKey] = computed(
        () => state.recoStatus[auditId][normGroup]
      );
    }
    return computedCache[cacheKey];
  };

  return {
    isRecoDone,
    toggleReco,
    getDoneIds,
  };
}
