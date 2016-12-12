import FPSCounter from './utils/fps-counter'

import NormalCanvasProcess from './docs/normal-summary'

window.addEventListener('DOMContentLoaded', async e => {
  const dest = document.createElement('canvas')
  dest.width = 640
  dest.height = 360
  document.body.appendChild(dest)

  if (window.__mode === 'normal') {
    const counter = new FPSCounter()
    await NormalCanvasProcess.attachCanvas(dest)

    const render = () => {
      counter.count()
      NormalCanvasProcess.render()
      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  } else {
    const counter = new FPSCounter()
    const worker = new Worker('./dist/worker-summary.js')

    const waitResponse = () => new Promise(resolve => {
        worker.addEventListener('message', ({data}) => {
            data.action === 'resolve' && resolve(data)
        }, {once: true})
    })

    const offscreen = dest.transferControlToOffscreen()
    worker.postMessage({action: 'attachCanvas', canvas: offscreen}, [offscreen])
    await waitResponse()

    const render = async () => {
      counter.count()

      worker.postMessage({action: 'render'})
      await waitResponse()

      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  }
})
