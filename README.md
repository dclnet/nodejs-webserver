# nodejs-webserver
webserver base on nodejs net module<br>
<br>
启动 node app.js   默认监听80端口<br>
<br>
配置文件 ./server/config.json<br>
<br>
{<br>
>"charset": "utf-8",     // 编码<br>
>"port": 80,             // 监听端口<br>
>"session": 1,<br>
>"session_key": "DCSESSIONID",   // 会话cookie name<br>
>"session_key_secret": "Decheng@Xst_com$",   // 会话ID加密盐<br>
>"session_expire": 36000000,                 // 默认会话超时时间<br>
>// 虚拟主机<br>
>"vhost": [<br>
>>{<br>
>>>"server_name": ["localhost"],     // 虚拟主机域名<br>
>>>"root": "../webapp/test1",        // 虚拟主机根目录<br>
>>>"index": "index"                  // 入口模块，该模块必须实现service 方法处理客户端请求<br>
>>},<br>
>>{<br>
>>>"server_name": ["dev1.xst.com", "dev2.xst.com"],<br>
>>>"root": "../webapp/test2",<br>
>>>"index": "default"<br>
>>}<br>
>]<br>
}<br>
