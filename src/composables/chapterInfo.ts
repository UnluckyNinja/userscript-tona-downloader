import { getChapterInfo } from '@/lib/download'

export const useChapterInfo = createGlobalState(() => {
  const info = ref<{ title: string, images: string[] } | null>(null)
  const error = ref<Error | null>(null)

  getChapterInfo().then((root) => {
    info.value = {
      title: root.readableProduct.title,
      images: root.readableProduct.pageStructure.pages.filter(it => it.src).map(it => it.src) as string[],
    }
  }).catch((e) => {
    error.value = e
  })

  return {
    info,
    error,
  }
})
