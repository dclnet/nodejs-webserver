var template = require('../../lib/template');
var router = require('../../lib/router');
var fs = require('fs');

function service(request, response) {
    var context = this;
    // 路由解析
    var pathInfo = router.parse(request["path"]);
    pathInfo["action"] = pathInfo["action"] ? pathInfo["action"] : 'index';
    // 开启会话
    context.session.start();

    if (pathInfo["module"] && fs.existsSync(__dirname + '/' + pathInfo["module"]+'.js')) {
        // 相应模块处理请求
        var module = require(__dirname + '/' + pathInfo["module"]);
        if (module[pathInfo["action"]] != undefined) {
            module[pathInfo["action"]].call(context, request, response);
            return null;
        }
    }

    if (request["method"] == "GET") {
        doGet(context, request, response);
    } else if (request["method"] == "POST") {
        doPost(context, request, response);
    }
}

// 默认首页
function doGet(context, request, response) {
    var data = {};
    if (context.session.getValue('logined') == 1) {
        data["visit_count"] = context.session.getValue("visit_count");
        data["username"] = context.session.getValue("login_username");
        context.session.setValue("visit_count", data["visit_count"] + 1);
        data["menu"] = '<a href="/user/logout">退 出</a>';
    } else {
        data["username"] = "Guest";
        data["visit_count"] = 0;
        data["menu"] = '<a href="/user/login">登 录</a>';
    }
    response.out(template.render(__dirname+'/template/index.html', data));
}

function doPost(context, request, response) {
    response.out("<h3>this is post request.</h3>");
}

exports.service = service;