# nodejs-webserver
webserver base on nodejs net module

启动 node app.js   默认监听80端口

配置文件 ./server/config.json

{
    "charset": "utf-8",     // 编码
    "port": 80,             // 监听端口
    "session": 1,
    "session_key": "DCSESSIONID",   // 会话cookie name
    "session_key_secret": "Decheng@Xst_com$",   // 会话ID加密盐
    "session_expire": 36000000,                 // 默认会话超时时间
    // 虚拟主机
    "vhost": [
        {
            "server_name": ["localhost"],     // 虚拟主机域名
            "root": "../webapp/test1",        // 虚拟主机根目录
            "index": "index"                  // 入口模块，该模块必须实现service 方法处理客户端请求
        },
        {
            "server_name": ["dev1.xst.com", "dev2.xst.com"],
            "root": "../webapp/test2",
            "index": "default"
        }
    ]
}
