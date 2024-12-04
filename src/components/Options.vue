<script setup lang="ts">
import { downloadImagesAsZIP } from '@/lib/download'
import { useOptions } from '../store'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from './ui/number-field'

const {
  DIVIDE_NUM,
  MULTIPLE,
} = useOptions()

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
</script>

<template>
  <Card class="dark bg-slate-9 min-w-md abc">
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
      <hr class="border-gray border-solid border-t bg-none">
      <div class="flex place-content-center">
        <Button :disabled="lockButton" @click="download">
          {{ text }}
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<style></style>
