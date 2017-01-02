function response(conf) {
    this.header = ["Server: decheng/1.0", "X-Powered-By: decheng"];
    this.cookie = [];
    this.body = '';
    this.type = {
        html: "text/html",
        json: "application/json",
        xml: "text/xml",
        jpg: "image/jpeg",
        gif: "image/gif",
        ico: "application/x-ico",
        txt: "text/plain",
        asp: "text/asp",
        css: "text/css",
        js: "application/x-javascript"
    };
    this.statusCode = '';
    this.contentType = '';
    this.config = {}
    this.config["charset"] = conf["charset"] != undefined ? conf["charset"] : "utf-8";
}
response.prototype.success = function() {
    if (this.statusCode == '') {
        this.header.unshift("HTTP/1.1 200 OK");
        this.statusCode = 200;
    }
}

response.prototype.notFound = function() {
    if (this.statusCode == '') {
        this.header.unshift("HTTP/1.1 404 Not Found");
        this.statusCode = 404;
    }
}

response.prototype.setContentType = function(ext, encode) {
    if (this.type[ext] !== undefined) {
        if (encode == undefined) { encode = "utf-8"}
        this.contentType = this.type[ext] + "; charset="+encode+";";
        this.setHeader("Content-Type", this.contentType);
    }
}
response.prototype.setHeader = function(key, val) {
    key[0] = key[0].toUpperCase();
    this.header.push(key + ': ' + val);
}

response.prototype.setCookie = function(key, val, expires, domain, path) {
    var date = null;
    path = path == undefined ? '/' : path;
    if (expires == undefined) {
        date = new Date();
        date.setTime(date.valueOf() + 3600000);
        expires = date.toUTCString();
    }
    val = key + '=' + val + "; expires=" + expires + "; path=" + path;
    if (domain != undefined) {
        val += "; domain=" + domain;
    }
    this.cookie.push(val);
}

response.prototype.setCookies = function(cookies, expires, domain, path) {
    for(var key in cookies) {
        this.setCookie(key, cookies[key], expires, domain, path);
    }
}

response.prototype.out = function(string) {
    this.body += string;
}

response.prototype.flush = function() {
    var content = '';
    if (this.contentType == '') {
        this.setContentType('html', this.config["charset"]);
    }
    var header = this.header.join("\r\n");
    if (this.cookie) {
        header = header + "\r\n" + 'Set-Cookie: ' + this.cookie.join("\r\n");
    }

    content = header + "\r\n\r\n" + this.body;
    return content;
}

response.prototype.redirect = function(url) {
    if (this.statusCode == '') {
        this.body = '';
        this.header.unshift("HTTP/1.1 302 Moved Temporarily");
        this.setHeader('Location', url);
        this.statusCode = 302;
    }
}

exports.response = response;