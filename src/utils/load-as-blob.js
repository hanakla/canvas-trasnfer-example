export default function (url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = e => resolve(xhr.response)
        xhr.open('GET', url)
        xhr.send()
    })
}
