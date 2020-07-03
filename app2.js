let fs = require('fs')
let http = require('http')
let template = require('art-template')
let url = require('url')

let comments = [
    {
        name: '张三',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    },
    {
        name: '张三2',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    },
    {
        name: '张三3',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    },
    {
        name: '张三4',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    },
    {
        name: '张三5',
        message: '今天天气不错！',
        dateTime: '2015-10-16'
    },
]

// http://localhost:3000/pinglun?name=11&message=11111
// 对于这种表单提交的路劲请求，由于其中具有用户动态填写的内容
// 所以你不可能去通过判断完整的URL路径来处理这个请求
//
// 结论:对于我们来讲，其实只需要判定，如果你的请求路径是 /pinglun 的时候，那我就认你的提交表单的请求过来了

http
    .createServer((req, res) => {
        // 使用url.parse 方法将路径解析为一个方便操作的对象，第二个参数为true标识直接将查询字符串转换为一个对象（通过query属性访问）
        let parseObj = url.parse(req.url, true)

        // 单独获取不包含查询字符串的路径部分(该路径不包含？之后的内容)
        let pathname = parseObj.pathname
        console.log(pathname)
        if (pathname === '/') {
            fs.readFile('./views/index.html', (err, data) => {
                if (err) {
                    return res.end('读取页面失败')
                }
                let htmlStr = template.render(data.toString(), {
                    comments
                })
                res.end(htmlStr)
            })
        } else if (pathname === '/post') {
            fs.readFile('./views/post.html', (err, data) => {
                if (err) {
                    return res.end('读取页面失败')
                }
                res.end(data)
            })
        }
        else if (pathname == '/pinglun') {
            // 注意：这个时候无论/pinglun?xxx 之后是什么，我都不用担心了，因为我的path
            // console.log("收到表单请求了", parseObj.query)

            // 一次请求对应一个响应，响应结束这次请求也就结束了
            // res.end(JSON.stringify(parseObj.query))

            // 我们已经使用 url 模块 parse 方法把请求路径中的查询字符串解析成一个对象了
            // 所以接下来要做的就是：
            //  1.获取表单提交的数据    parseObj.query
            //  2.生成日期到数据对象中，然后存储到数组中
            //  3.当用户重定向到跳转到首页 
            //      当用户重新请求 / 的时候，我们数组中的数据已经发生变化了，所以用户看到的数据不一样

            let commont = parseObj.query
            commont.dateTime = '2017'
            comments.unshift(commont)
            // 服务端这个数据存储好了，接下来就是让用户重新请求首页，就可以看到最新的留言内容了
            
            // 如何通过服务器让客户端重定向？
            // 1.状态码设置为302时为临时重定向
            //      statusCode
            // 2.在响应头中通过 location 告诉客户端往哪重定向
            //      setHeader
            // 如果客户端发现收到服务器的响应的状态码是302 就会自动去响应头中找 Location，然后对该地址发起新的请求
            // 所以你就能看到客户端自动跳转了

            res.statusCode = 302
            res.setHeader('Location','/')
            res.end()
        }
        else if (pathname.indexOf('/public/' == 0)) {
            fs.readFile('.' + pathname, (err, data) => {
                if (err) {
                    return res.end('静态资源渲染失败')
                }
                res.end(data)
            })
        }
        else {
            res.readFile('./views/404.html', (err, data) => {
                // res.setHeader('Content-Type', 'text/html;charset=utf-8')
                res.end(data)
            })
        }
    })
    .listen(3000, () => {
        console.log('running...')
    })