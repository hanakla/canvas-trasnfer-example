import Filters from 'canvasfilters'
import blur from '../filters/blur'
import highpass from '../filters/highpass'

import loadAsBlob from '../utils/load-as-blob'

export default class NormalProcess {
  static async _preload()
  {
    const imageBlob = await loadAsBlob('/src/images/example.png')
    this.sourceImage = await createImageBitmap(imageBlob)
  }

  static async attachCanvas(canvas)
  {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    await this._preload()
  }

  static render()
  {
    const {ctx, sourceImage, canvas: {width, height}} = this
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(sourceImage, 0, 0)

    const srcImageBuffer = ctx.getImageData(0, 0, width, height)

    const imageBlurred = blur(srcImageBuffer, 10)
    const imageLowPass = blur(highpass(srcImageBuffer, 230), 80)
    const destinate = Filters.screenBlend(Filters.multiplyBlend(srcImageBuffer, imageBlurred), imageLowPass)

    ctx.putImageData(new ImageData(destinate.data, destinate.width, destinate.height), 0, 0)
  }
}
