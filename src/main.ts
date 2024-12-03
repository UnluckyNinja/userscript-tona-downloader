import resetCss from '@unocss/reset/tailwind.css?inline'
import unoCss from 'virtual:uno.css?inline'
import { createApp } from 'vue'
import App from './App.vue'
import styleCss from './style.css?inline'

const app = createApp(App)
const wrapper = document.createElement('div')
document.body.append(wrapper)
const shadow = wrapper.attachShadow({ mode: 'open' })
const element = document.createElement('div')
shadow.appendChild(element)

app.mount(element)

function addStyle(content: string) {
  const cssEle = document.createElement('style')
  cssEle.textContent = content
  shadow.appendChild(cssEle)
  return cssEle
}
addStyle(resetCss)
const unoEle = addStyle(unoCss)
const styleEle = addStyle(styleCss)

if (import.meta.hot) {
  import.meta.hot.accept([
    './style.css?inline',
    '/__uno.css?inline',
  ], ([styleCss, unoCss]) => {
    if (styleCss) {
      styleEle.textContent = styleCss.default
    }
    if (unoCss) {
      unoEle.textContent = unoCss.default
    }
  })
}
