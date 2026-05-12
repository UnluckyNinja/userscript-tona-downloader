<script setup lang="ts">
import { useChapterInfo } from '@/composables/chapterInfo'
import { downloadImagesAsZIP, drawImage } from '@/lib/download'
import { useOptions } from '../store'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from './ui/number-field'
import Switch from './ui/switch/Switch.vue'

const {
  DIVIDE_NUM,
  MULTIPLE,
  USE_CREDENTIALS,
} = useOptions()

const { info, error: infoError } = useChapterInfo()

const text = ref('下载本章节（下载完成后需再次点击以保存）')
const result = ref<Awaited<ReturnType<typeof downloadImagesAsZIP>>>(null)
const lockButton = ref(false)
async function download() {
  if (!result.value) {
    lockButton.value = true

    try {
      result.value = await downloadImagesAsZIP(text)
    } catch (e) {
      text.value = '下载失败'
      console.error(e)
    }

    text.value = '下载完成，点击保存'
    lockButton.value = false
  } else {
    const a = document.createElement('a')
    a.download = `${result.value.title}.zip`
    const url = URL.createObjectURL(result.value.blob)
    a.href = url
    a.target = '_blank'
    a.click()
    nextTick(() => URL.revokeObjectURL(url))
  }
}

async function openImage(url: string) {
  const canvas = new OffscreenCanvas(1, 1)
  const blob = await drawImage(canvas, url)
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, '_blank')
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl)
  }, 5000)
}
</script>

<template>
  <Card class="dark bg-sky-950 min-w-md abc">
    <CardHeader class="text-center">
      <CardTitle class="text-center">
        下载选项
      </CardTitle>
    </CardHeader>
    <CardContent class="space-y-xs">
      <!-- simple options -->
      <div class="flex">
        <div class="flex-auto">
          横/纵区域格数
        </div>
        <div class="flex justify-end">
          <NumberField v-model:model-value="DIVIDE_NUM" :min="1">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </div>
      <div class="flex">
        <div class="flex-auto">
          像素对齐比例
        </div>
        <div class="flex justify-end">
          <NumberField v-model:model-value="MULTIPLE" :min="1">
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </div>
      <div class="flex">
        <div class="flex-auto">
          使用cookie请求图片
        </div>
        <div class="flex justify-end">
          <Switch v-model:model-value="USE_CREDENTIALS" />
        </div>
      </div>
      <hr class="border-gray border-solid border-t bg-none">
      <div>若出现异常请刷新后重试</div>
      <div v-if="infoError" class="text-red">
        {{ infoError.message }}
      </div>
      <div v-else-if="info" class="max-h-30 overflow-y-auto overflow-x-hidden">
        <div>预览</div>
        <div class="grid grid-cols-10 space-x-1 space-y-1">
          <span v-for="url, i in info.images" :key="i" class="col-span-1">
            <Button size="sm" class="cursor-pointer w-full" @click="openImage(url)">
              {{ i + 1 }}
            </Button>
          </span>
        </div>
      </div>
      <div class="flex place-content-center">
        <Button :disabled="lockButton" class="cursor-pointer" @click="download">
          {{ text }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style></style>
