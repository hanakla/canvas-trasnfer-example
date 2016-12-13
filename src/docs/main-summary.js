import FPSCounter from '../utils/fps-counter'

window.addEventListener('DOMContentLoaded', async e => {
    const worker = new Worker('./dist/worker-summary.js')

    // Workerの処理完了を待つためのヘルパ
    const waitResponse = () => new Promise(resolve => {
        worker.addEventListener('message', ({data}) => {
            data.action === 'resolve' && resolve(data)
        }, {once: true})
    })

    const dest = document.createElement('canvas')
    dest.width = 640
    dest.height = 360
    document.body.appendChild(dest)

    // canvas要素からOffscreenCanvasを生成して、Workerスレッドへ転送する
    const offscreen = dest.transferControlToOffscreen()
    worker.postMessage({action: 'attachCanvas', canvas: offscreen}, [offscreen])
    await waitResponse()

    const counter = new FPSCounter()
    const render = async () => {
        counter.count()

        // Workerへレンダリングを要求して、レンダリングの終わりを待つ
        worker.postMessage({action: 'render'})
        await waitResponse()

        // 次のフレームをレンダリング
        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
})
