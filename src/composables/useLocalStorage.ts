import { ref, watch, type Ref } from 'vue';

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// handle if user blocks site data
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
  parseFn: (raw: unknown) => T | null,
): { state: Ref<T>; resetState: () => void } {
  const storage = getLocalStorage();
  let saved: T | null = null;

  // grab from storage
  try {
    const raw = storage?.getItem(key) ?? null;

    if (raw !== null) {
      saved = parseFn(JSON.parse(raw));
    }
  } catch {
    saved = null;
  }

  const state = ref(deepCopy(saved ?? defaults)) as Ref<T>;

  // saving
  watch(
    state,
    (value) => {
      try {
        storage?.setItem(key, JSON.stringify(value));
      } catch {
        // storage full/unavailable
      }
    },
    { deep: true },
  );

  function resetState() {
    state.value = deepCopy(defaults);
  }

  return { state, resetState };
}
