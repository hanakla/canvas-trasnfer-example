const loadAsset = url => new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'blob'
    xhr.onload = e => resolve(xhr.response)
    xhr.open('GET', url)
    xhr.send()
})

export default async function (canvas, ctx) {
    const imageBlob = await loadAsset('/src/images/example.png')
    const image = await createImageBitmap(imageBlob)

}
