import { ref, watch, type Ref } from 'vue';

// Returns null if the user has blocked site data
function getLocalStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function useLocalStorage<T>(
  key: string,
  defaults: T,
  parse: (raw: unknown) => T | null,
): { state: Ref<T>; resetState: () => void } {
  const storage = getLocalStorage();
  let saved: T | null = null;

  try {
    const raw = storage?.getItem(key) ?? null;

    if (raw !== null) {
      saved = parse(JSON.parse(raw));
    }
  } catch {
    saved = null;
  }

  const state = ref(structuredClone(saved ?? defaults)) as Ref<T>;

  watch(
    state,
    (value) => {
      try {
        storage?.setItem(key, JSON.stringify(value));
      } catch {
        // Storage is full or unavailable, but keeps working without saving
      }
    },
    { deep: true },
  );

  function resetState() {
    state.value = structuredClone(defaults);
  }

  return { state, resetState };
}
