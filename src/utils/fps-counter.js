export default class FPSCounter
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

            console.log('%dfps', this.fps);
        }
    }
}
