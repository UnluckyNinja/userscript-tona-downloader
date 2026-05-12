import unoCss from 'unocss-inline/style'
import { createApp } from 'vue'

import App from './App.vue'
// wrap widget in shadow DOM to avoid polluting page
import { portalTarget, shadowRoot } from './shadowRoot'

import styleCss from './style.css?inline'

const appStyleSheet = new CSSStyleSheet()
appStyleSheet.replaceSync(styleCss)
shadowRoot.adoptedStyleSheets.push(appStyleSheet)

createApp(App).mount(portalTarget)

// @property unfortunately will be ignored in shadow DOM,
// so we have to move them to the root document.
// there are some other directives in it, I guess it won't hurt though.
const sheet = new CSSStyleSheet()
const mo = new MutationObserver((list, obs) => {
  // console.log(list)
  const text = unoCss.textContent.split('\n').filter(it => it.startsWith('@') && it.endsWith('}')).join('\n')
  // console.log(text)
  sheet.replaceSync(text)
})

// observe unocss style element change to hoist @property lines
// in Chrome: childList is needed
// in Firefox: subtree + characterData will work, while childList will not work.
mo.observe(unoCss, {
  childList: true,
  subtree: true,
  characterData: true,
})

shadowRoot.appendChild(unoCss)
document.adoptedStyleSheets.push(sheet)

// HMR for styles
if (import.meta.hot) {
  import.meta.hot.accept([
    './style.css?inline',
  ], ([styleCss]) => {
    if (styleCss) {
      appStyleSheet.replace(styleCss.default)
    }
  })
}
