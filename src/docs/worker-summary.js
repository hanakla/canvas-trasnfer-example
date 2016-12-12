import Filters from 'canvasfilters'
import blur from '../filters/blur'
import highpass from '../filters/highpass'

import loadAsBlob from '../utils/load-as-blob'

new class WorkerProcess {
  constructor() {
    this.handleMessage()
  }

  handleMessage()
  {
    self.onmessage = async ({data: {action, ...props}}) => {
        switch (action) {
          case 'attachCanvas':
            await this.attachCanvas(props)
            break;

          case 'render':
            await this.render()
            break;
        }

        self.postMessage({action: 'resolve'})
    }
  }

  async _preload()
  {
    const imageBlob = await loadAsBlob('/src/images/example.png')
    this.sourceImage = await createImageBitmap(imageBlob)
  }

  async attachCanvas({canvas})
  {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    await this._preload()
  }

  async render()
  {
    const {ctx, sourceImage, canvas: {width, height}} = this
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(sourceImage, 0, 0)

    const srcImageBuffer = ctx.getImageData(0, 0, width, height)

    const imageBlurred = blur(srcImageBuffer, 10)
    const imageLowPass = blur(highpass(srcImageBuffer, 230), 80)
    const destinate = Filters.screenBlend(Filters.multiplyBlend(srcImageBuffer, imageBlurred), imageLowPass)

    ctx.putImageData(new ImageData(destinate.data, destinate.width, destinate.height), 0, 0)
    ctx.commit()
  }
}
