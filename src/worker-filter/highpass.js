import {join} from 'path'
// import Self from 'worker-loader?inline!./blur'

import blur from '../filters/blur'
import {luminance} from 'canvasfilters'

export default class WorkerhighpassFilter {
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

    async apply(srcImageData, threshold)
    {
        const src = new ImageData(srcImageData.width, srcImageData.height)
        src.data.set(srcImageData.data)

        const imageBuffer = await this._postMessage({
            image: src.data,
            width: src.width,
            height: src.height,
            threshold
        }, [src.data])

        return new ImageData(imageBuffer, src.width, src.height)
    }

    renderWorker(image, width, height, threshold)
    {
        const srcImageData = new ImageData(image, width, height)
        const result = new ImageData(width, height)
        const {data: luminanceBuffer} = luminance(srcImageData)

        for (let idx = 0, length = result.data.length; idx < length; idx += 4) {
            // fill alpha
            result.data[idx + 3] = 255

            if (luminanceBuffer[idx] >= threshold) {
                result.data[idx] = luminanceBuffer[idx]
                result.data[idx + 1] = luminanceBuffer[idx + 1]
                result.data[idx + 2] = luminanceBuffer[idx + 2]
            } else {
                result.data[idx] = 0
                result.data[idx + 1] = 0
                result.data[idx + 2] = 0
            }

        }

        self.postMessage(result.data, [result.data])
    }
}

if (typeof self !== 'object') {
    new WorkerhighpassFilter()
}
