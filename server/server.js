var net = require('net');
var fs = require('fs');
var httpParser = require('./httpParser');
var response = require('./response');
var session = require('./session');

function Server(conf) {
    this.vhost = {};
    // 加载config.json 配置文件
    conf = conf == undefined ? (__dirname + '/config.json') : conf;
    this.configs = JSON.parse(fs.readFileSync(conf));

    // 创建虚拟主机列表
    var len = this.configs.vhost.length;
    var vhost = this.configs.vhost;
    for(var i = 0; i < len; i++) {
        for(var j = 0; j < vhost[i]["server_name"].length; j++) {
            this.vhost[vhost[i]["server_name"][j]] = vhost[i];
        }
    }
}

// 分发给对应虚拟主机处理请求
Server.prototype.process = function(context, req, resp) {
    var vhost = this.vhost[req['Host']]
    if (vhost != undefined) {
        // 静态文件存在则直接读取并返回给客户端
        var filePath = __dirname + '/' + vhost["root"] + req["path"];
        if (req["path"] != '/' && fs.existsSync(filePath)) {
            resp.setContentType(req["path"].substring(req["path"].lastIndexOf('.')+1));
            resp.out((fs.readFileSync(filePath)).toString());
            return true;
        }
        if (req["query_file"].indexOf('.') !== -1) {
            resp.notFound();
            return false;
        }
        // 文件不存在，处理请求
        var handler = require(__dirname + '/' + vhost["root"] + "/" + vhost["index"]);
        // web app 入口模块必须实现 service 方法来处理请求
        if (handler["service"] != undefined) {
            handler["service"].call(context, req, resp);
        }
        return true;
    }
}

// 启动web server
Server.prototype.startHttpServer = function() {
    var self = this;
    // 初始化 session数据库
    var sessionStorage = new session.SessionStorage();
    var server = net.createServer(function(socket) {
        socket.on('data', function(data) {
            console.log("\n===================================");

            // 解析http请求，创建request
            request = httpParser.parser(data.toString(self.configs.charset));
            console.log(request);
            // 创建response对象
            var resp = new response.response({charset: self.configs["charset"]});

            // 执行环境
            var context = {
                charset: self.configs["charset"],
                session: (new session.SessionServer({
                    key: self.configs["session_key"],
                    secret: self.configs["session_key_secret"],
                    storage: sessionStorage,
                    cookie: request["Cookie"]
                }))
            };

            // 分发处理
            self.process(context, request, resp);
            resp.success();

            // 设置会话cookie 
            if (context.session.getSessionId() != '') {
                var date = new Date();
                date.setTime(date.valueOf() + (context.session.getSessionExpire() ? context.session.getSessionExpire() : self.configs["session_expire"]));
                resp.setCookie(context.session.getSessionCookieKey(), context.session.getSessionId(), date.toUTCString(), context.session.getSessionHost() ? context.session.getSessionHost() : request['Host']);
            }
            
            // 输出数据到客户端
            socket.end(resp.flush());
        });

        socket.on('end', function() {
            console.log('server disconnected.');
        });
    });

    server.listen(this.configs.port, function() {
        console.log('server start:' + self.configs.port);
    });
}

exports.WebServer = Server;