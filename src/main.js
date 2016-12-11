import BlurEffect from './filters/blur'

import Filters from 'canvasfilters'
import blur from './filters/blur'
import highpass from './filters/highpass'
import lowpass from './filters/lowpass'

import WorkerBlurFilter from './worker-filter/blur'

class FPSCounter
{
    constructor() {
        this.logs = []
        this.frame = 0
        this.fps = 0
        this.lastCountTime = Date.now()
    }

    count()
    {
        this.frame++

        const now = Date.now()
        if (now - this.lastCountTime >= 1000) {
            this.logs.push(this.fps)

            this.fps = this.frame
            this.frame = 0
            this.lastCountTime = now

            if (this.logs.length >= 5 + 1) {
                const logs = this.logs.slice(1)
                console.log(logs, logs.reduce((m, value) => m + value, 0) / logs.length);
                throw new Error('count stop')
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', async e => {
    const distCanvas = document.querySelector('#canvas')
    const ctx = distCanvas.getContext('2d')
    ctx.font = '24px/1 sans-serif'
    ctx.textBaseline = 'top'

    // const worker = new Worker('./dist/worker.js')
    // const awaitResponse = () => new Promise(resolve => {
    //     worker.addEventListener('message', ({data}) => {
    //         data.action === 'resolve' && resolve(data)
    //     }, {once: true})
    // })

    const imageBlob = await (await fetch('./src/images/example.png')).blob()
    const image = await createImageBitmap(imageBlob)

    // Single thread
    const animateSigleThread = async () => {
        const counter = new FPSCounter

        const animate = () => {
            counter.count()

            const {width, height} = canvas
            ctx.clearRect(0, 0, 640, 360)
            ctx.drawImage(image, 0, 0)

            const srcImageBuffer = ctx.getImageData(0, 0, width, height)

            const imageBlurred = blur(srcImageBuffer, 20)
            const imageLowPass = blur(highpass(srcImageBuffer, 230), 80)

            const destinate = Filters.screenBlend(
                Filters.multiplyBlend(srcImageBuffer, imageBlurred),
                imageLowPass,
            )
            // const destinate = Filters.multiplyBlend(srcImageBuffer, imageBlurred)
            // const destinate = imageLowPass

            // BlurEffect.render(distCanvas, canvas.width, canvas.height, 2)

            ctx.putImageData(destinate, 0, 0)
            // ctx.putImageData(imageLowPass, 0, 0)
            ctx.fillText(`fps: ${counter.fps}`, 0, 0)
            requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }


    // Multi Thread
    const animateMultiThread = async () => {
        const counter = new FPSCounter

        const blur = new WorkerBlurFilter
        const highpass = new WorkerHighpassFilter

        const buffer = document.createElement('canvas')
        buffer.width = distCanvas.width
        buffer.height = distCanvas.height
        document.body.appendChild(buffer)

        const offscreen = buffer.transferControlToOffscreen()

        worker.postMessage({action: 'attach-canvas', canvas: offscreen}, [offscreen])
        await awaitResponse()

        worker.postMessage({action: 'preload'})
        await awaitResponse()

        const animate = async () => {
            counter.count()

            const {width, height} = canvas
            ctx.clearRect(0, 0, 640, 360)
            ctx.drawImage(image, 0, 0)

            // worker.postMessage({action: 'render'})
            // const {image: imageBitmap} = await awaitResponse()
            //
            // ctx.clearRect(0, 0, 640, 360)
            //
            // ctx.drawImage(imageBitmap, 0, 0)
            //
            // ctx.fillText(`fps: ${counter.fps}`, 0, 0)
            // requestAnimationFrame(animate)
            // // imageBitmap.close()
        }

        requestAnimationFrame(animate)
    }

    animateSigleThread()
    // animateMultiThread()
    console.log('init');
})
