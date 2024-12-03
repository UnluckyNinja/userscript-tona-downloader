import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function lerp(a: number, b: number, x: number, clamp = true) {
  if (!clamp) {
    return a + (b - a) * x
  }
  ;[a, b] = a - b > 0 ? [b, a] : [a, b]
  return Math.max(a, Math.min(a + (b - a) * x, b))
}

export function invLerp(a: number, b: number, x: number, clamp = true) {
  if (!clamp)
    return (x - a) / (b - a)
  return Math.max(0, Math.min((x - a) / (b - a), 1))
}

export function remap(a: number, b: number, m: number, n: number, x: number, clamp = true) {
  const _x = invLerp(a, b, x, clamp)
  return lerp(m, n, _x, clamp)
}

export function solve(options: {
  image: CanvasImageSource
  DIVIDE_NUM: number
  cell_width: number
  cell_height: number
  context2d: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
}) {
  const {
    image,
    DIVIDE_NUM,
    cell_width,
    cell_height,
    context2d,
  } = options
  // this.view.drawImage(0, 0, this.width, this.height, 0, 0);
  for (let e = 0; e < DIVIDE_NUM * DIVIDE_NUM; e++) {
    const srcY = Math.floor(e / DIVIDE_NUM) * cell_height
    const srcX = (e % DIVIDE_NUM) * cell_width
    const r = Math.floor(e / DIVIDE_NUM)
    const n = (e % DIVIDE_NUM) * DIVIDE_NUM + r
    const desX = (n % DIVIDE_NUM) * cell_width
    const desY = Math.floor(n / DIVIDE_NUM) * cell_height
    context2d.drawImage(image, srcX, srcY, cell_width, cell_height, desX, desY, cell_width, cell_height)
  }
}
