# 跨域demo

创建步骤：
1. 修改hosts
设置本地域名映射需要修改`hosts`，找到`hosts`文件并在文件中添加以下内容
```
127.0.0.1 qq.com
127.0.0.1 jojo.com
```

2. 开启服务

qq-com:
```sh
node-dev server 8888
```
jojo-com
```sh
node-dev server 9999
```
3. 访问

   访问qq.com使用：http://qq.com:8888/index.html

   访问jojo.com使用：http://jojo.com:9999/index.html

## 使用CORS进行跨域
jojo.js
```js
const request = new XMLHttpRequest()
request.open('GET', 'http://qq.com:8888/friends.json')
request.onreadystatechange = () => {
    if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
            console.log(request.response)
        } 
    }
}
request.send()
```
qq端的server.js
```js
 else if (path === '/friends.json') { // CORS 实现跨域
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/json;charset=utf-8')
    console.log(request.headers['referer']) // 通过打印出的referer可以知道发请求过来的是哪个网站
    response.setHeader('Access-Control-Allow-Origin', 'http://jojo.com:9999')
    response.write(fs.readFileSync('./public/friends.json'))
    response.end()
  }
```
## 使用JSONP进行跨域
jojo.js
```js
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
```
qq端的server.js
```js
else if (path === '/friends.js') { // JSONP 实现跨域
    if (request.headers["referer"].indexOf("http://jojo.com:9999") === 0) {
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/javascript;charset=utf-8')
      const string = `window['{{xxx}}']({{data}})` // 这里不是很懂为什么'{{xxx}}'可以是字符串而{{data}}不能为字符串
      const data = fs.readFileSync('./public/friends.json').toString()
      const string2 = string.replace("{{data}}", data).replace('{{xxx}}', query.callback)
      response.write(string2)
      response.end()
    } else {
      response.statusCode = 404
      response.end()
    }
```
