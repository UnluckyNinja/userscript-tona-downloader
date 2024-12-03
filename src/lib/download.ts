import type { Root } from './json'
import { GM } from '$'
import { useOptions } from '@/store'
import { zip } from 'fflate'
import { solve } from './utils'

// const map = new Map([
//   ['image/jpeg', '.jpg'],
//   ['image/png', '.png'],
//   ['image/webp', '.webp'],
//   ['image/avif', '.avif'],
//   ['image/gif', '.gif'],
// ])

export async function downloadImagesAsZIP(status: Ref<string>) {
  status.value = '准备下载……'
  const jsonURL = `${window.location.href}.json`
  const json = (await GM.xmlHttpRequest({
    url: jsonURL,
    method: 'GET',
    responseType: 'json',
  }) as any).response as Root

  const title = json.readableProduct.title
  const urls = json.readableProduct.pageStructure.pages.filter(it => it.src).map(it => it.src) as string[]

  const blobs = []
  const canvas = new OffscreenCanvas(1, 1)
  for (let i = 0; i < urls.length; ++i) {
    const url = urls[i]
    const blob = await drawImage(canvas, url)
    if (blob) blobs.push(blob)
    status.value = `已下载 ${i + 1} / ${urls.length}`
  }

  status.value = '打包中……'
  const digits = (blobs.length + 1).toString().length
  const files = {} as Record<string, Uint8Array>
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i]
    files[`${(i + 1).toString().padStart(digits, '0')}.png`] = new Uint8Array(await blob.arrayBuffer())
    status.value = `已打包 ${i + 1} / ${blobs.length}`
  }

  const zipped = await new Promise<Uint8Array | null>((r, j) => {
    zip(files, (err, data) => {
      if (err) {
        j(new Error('打包时发生错误……'))
      }
      r(data)
    })
  })
  if (!zipped) return null

  const finalBlob = new Blob([zipped.buffer], { type: 'application/zip' })
  return {
    title,
    blob: finalBlob,
  }
}

let lastRequestTime = 0
async function drawImage(canvas: OffscreenCanvas, url: string): Promise<Blob> {
  const { DIVIDE_NUM, MULTIPLE } = useOptions()
  if (Date.now() - lastRequestTime < 200) {
    await new Promise(r => setTimeout(r, 200 - (Date.now() - lastRequestTime)))
  }
  lastRequestTime = Date.now()

  const image = new Image()
  image.src = url
  image.crossOrigin = 'use-credentials'
  await new Promise(r => image.addEventListener('load', r))

  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context2d = canvas.getContext('2d')!
  const options = {
    image,
    DIVIDE_NUM: DIVIDE_NUM.value,
    cell_width: Math.floor(image.naturalWidth / (DIVIDE_NUM.value * MULTIPLE.value)) * MULTIPLE.value,
    cell_height: Math.floor(image.naturalHeight / (DIVIDE_NUM.value * MULTIPLE.value)) * MULTIPLE.value,
    context2d,
  }
  solve(options)

  return await canvas.convertToBlob()
}
