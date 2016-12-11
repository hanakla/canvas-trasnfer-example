import StackBlur from 'stackblur-canvas'

export default function (srcImageData, radius) {
    const result = new ImageData(srcImageData.width, srcImageData.height)
    result.data.set(srcImageData.data)

    StackBlur.imageDataRGBA(result, 0, 0, srcImageData.width, srcImageData.height, radius)

    return result
}
