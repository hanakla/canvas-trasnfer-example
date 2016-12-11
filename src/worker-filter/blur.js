import {join} from 'path'
// import Self from 'worker-loader?inline!./blur'

import StackBlur from 'stackblur-canvas'
import blur from '../filters/blur'

export default class WorkerBlurFilter {
    constructor()
    {
        if (typeof self !== 'object') {
            this.worker = new Worker(join('/dist/', __filename))
        } else {
            this._handleMessage()
        }
    }

    _handleMessage()
    {
        self.onmessage = async ({data}) => {
            await this.renderWorker(data.image, data.width, data.height, data.raduis)
        }
    }

    _postMessage(message, transfer)
    {
        this.worker.postMessage(message, transfer)

        return new Promise(resolve => {
            this.worker.addEventListener('message', e => resolve(e.data), {once: true})
        })
    }

    async apply(srcImageData, radius)
    {
        const src = new ImageData(srcImageData.width, srcImageData.height)
        src.data.set(srcImageData.data)

        const imageBuffer = await this._postMessage({
            image: src.data,
            width: src.width,
            height: src.height,
            radius
        }, [src.data])

        return new ImageData(imageBuffer, src.width, src.height)
    }

    renderWorker(image, width, height, radius)
    {
        const imageData = new ImageData(image, width, height)
        const result = StackBlur.imageDataRGBA(imageData, 0, 0, imageData.width, imageData.height, radius)
        self.postMessage(imageData.data, [imageData.data])
    }
}

if (typeof self !== 'object') {
    new WorkerBlurFilter()
}
