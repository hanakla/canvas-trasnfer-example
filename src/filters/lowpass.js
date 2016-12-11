import {luminance} from 'canvasfilters'

export default function lowpass(srcImageData, threshold = 0) {
    const result = new ImageData(srcImageData.width, srcImageData.height)
    const {data: luminanceBuffer} = luminance(srcImageData)

    for (let idx = 0, length = result.data.length; idx < length; idx += 4) {
        // fill alpha
        result.data[idx + 3] = 255

        if (luminanceBuffer[idx] <= threshold) {
            result.data[idx] = luminanceBuffer[idx]
            result.data[idx + 1] = luminanceBuffer[idx + 1]
            result.data[idx + 2] = luminanceBuffer[idx + 2]
        } else {
            result.data[idx] = 255
            result.data[idx + 1] = 255
            result.data[idx + 2] = 255
        }

    }

    return result
}
