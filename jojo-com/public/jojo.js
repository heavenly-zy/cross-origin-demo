// const request = new XMLHttpRequest()
// request.open('GET', 'http://qq.com:8888/friends.json')
// request.onreadystatechange = () => {
//     if (request.readyState === 4) {
//         if (request.status >= 200 && request.status < 300) {
//             console.log(request.response)
//         } 
//     }
// }
// request.send()

// 如果要支持IE等旧浏览器就使用JSONP实现跨域，因为JS引用是不受同源策略限制的，同源策略限制的只是对数据的请求（如AJAX）
function jsonp(url) {
    return new Promise((resolve, reject) => {
        const random = 'JOJOJSONPCallBackName' + Math.random()
        window[random] = data => {
            resolve(data)
        }
        const script = document.createElement('script')
        script.src = `${url}?callback=${random}`
        script.onload = () => {
            script.remove()
        }
        script.onerror = () => {
            reject()
        }
        document.body.appendChild(script)
    })
}

jsonp('http://qq.com:8888/friends.js')
    .then((data) => {
        console.log(data)
    })