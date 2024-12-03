import type { StorageLike } from '@vueuse/core'
import { GM_deleteValue, GM_getValue, GM_setValue } from '$'

const storage: StorageLike = {
  getItem(key) {
    return GM_getValue(key)
  },
  removeItem(key) {
    GM_deleteValue(key)
  },
  setItem(key, value) {
    GM_setValue(key, value)
  },
}
export const useOptions = createGlobalState(
  () => {
    const DIVIDE_NUM = useStorage('DIVIDE_NUM', 4, storage)
    const MULTIPLE = useStorage('MULTIPLE', 8, storage)

    function resetOptions() {
      DIVIDE_NUM.value = 4
      MULTIPLE.value = 8
    }

    return {
      DIVIDE_NUM,
      MULTIPLE,
      resetOptions,
    }
  },
)
