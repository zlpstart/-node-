// app 应用程序
// 把当前模块所有的依赖项都声明在模块最上面
// 为了让目录结构保持统一清晰，所以我们约定，把所有的HTML文件都放在views文件里
// 浏览器收到Html 响应内容之后，就要开始从上到下解析
// 当在解析的过程当中，如果发现：
//      link
//      script
//      img 
//      ...
// 等具有 src 或者 link 的 href的属性时候，浏览器会自动对这些资源发送请求。
// 我们为了方便统一处理这些静态资源，所以我们约定把所有的静态资源都存放在 public 目录中



let http = require('http')
let fs = require('fs')

http
.createServer((req,res) => {
    let url = req.url
    console.log(url)
    if(url === '/'){
        fs.readFile('./views/index.html',(err,data) => {
            if(err){
                return res.end('404 Not Found')
            }
            console.log(url)
            res.end(data)
        })
    }else if(url.indexOf('/public/' == 0)){
        // /public/css/main.css
        // /public/js/main.js
        // /public/lib/jquery.js
        // 统一处理：
        //      如果请求路径是以 /public/ 开头的。则我认为你要获取 public 中的某个资源
        //      所以我们就直接可以吧请求路径当做文件路径来直接进行读取
        // 哪些资源能被用户访问，哪些资源不能被用户访问，我现在可以用代码非常灵活的来实现
        // /index.html
        // /public 整个 public 目录中的资源都允许被访问


        // 注意：在服务当中，文件中的路径就不要去写相对路径了。
        // 因为这个时候所有的资源都是通过Url标识来获取的
        // 我的服务器开放了 /public/目录
        // 所以这里的请求路径都写成：/public/xxx
        // /在这里就是根路径的意思。
        // 浏览器会在真正访问请求的时候会把 127.0.0.1:3000 拼上
        // 不要在想文件路径了，把所有的路径都想象成url地址
        fs.readFile('.' + url,(err,data)=>{
            if(err){
                return res.end('404 Not Found.')
            }
            console.log(url)
            res.end(data)
        })
    }else{
        console.log('都不是')
        // 其他都找到404 找不到
        fs.readFile('./views/404.html',(err,data) => {
            if(err) {
                return res.end('404 Not Found.')
            }
            res.end(data)
        })
    }
})
.listen(3000,() => {
    console.log('running..')
})