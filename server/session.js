// session
function SessionServer(config) {
    this.sessionHash = '';
    this.sessionStorage = config.storage;
    this.session_cookie_key = config.key;
    this.session_cookie_key_secret = config.secret;
    this.session_expire = 0;
    this.session_host = '';
    this.cookie = config.cookie;
}

// 如要自定义session cookie key, 此方法必须在 session.start 之前调用
SessionServer.prototype.setSessionCookieKey = function(key) {
    this.session_cookie_key = key;
}

SessionServer.prototype.getSessionCookieKey = function() {
    return this.session_cookie_key;
}

SessionServer.prototype.setSessionExpire = function(second) {
    this.session_expire = second;
}

SessionServer.prototype.getSessionExpire = function() {
    return this.session_expire;
}

SessionServer.prototype.setSessionHost = function(host) {
    this.session_host = host;
}

SessionServer.prototype.getSessionHost = function() {
    return this.session_host;
}

// 开启会话
SessionServer.prototype.start = function() {
    if (this.cookie[this.session_cookie_key] != undefined) {
        this.sessionHash = this.cookie[this.session_cookie_key];
    } else {
        // create new session
        this.sessionHash = this.generateSessionHash();
    }
}

// 销毁回话
SessionServer.prototype.shutdown = function() {
    this.sessionStorage.destroy(this.sessionHash);
    delete this.cookie[this.session_cookie_key];
    this.sessionHash = '';
}

SessionServer.prototype.setValue = function(key, val) {
    this.sessionStorage.setValue(this.sessionHash, key, val);
}

SessionServer.prototype.getValue = function(key) {
    return this.sessionStorage.getValue(this.sessionHash, key);
}

SessionServer.prototype.getSessionId = function() {
    return this.sessionHash;
}

SessionServer.prototype.generateSessionHash = function() {
    var crypto = require('crypto');
    return crypto.createHash('md5').update((new Date()).getTime()+this.session_cookie_key_secret).digest('hex');
}

/*---------------------------------------------------------*/
// session 数据库 目前数据存于内存
function SessionStorage() {
    this.database = {};
}

SessionStorage.prototype.getValue = function(sessionHash, key) {
    if (sessionHash && this.database[sessionHash] != undefined) {
        return this.database[sessionHash][key];
    }
    return null;
}

SessionStorage.prototype.setValue = function(sessionHash, key, value) {
    if (sessionHash == undefined) {
        return false;
    }
    if (this.database[sessionHash] == undefined) {
        this.database[sessionHash] = {};
    }
    this.database[sessionHash][key] = value;
    return true;
}

SessionStorage.prototype.remove = function(sessionHash, key) {
    if (sessionHash && this.database[sessionHash] != undefined) {
        delete this.database[sessionHash][key];
    }
}

SessionStorage.prototype.destroy = function(sessionHash) {
    if (sessionHash && this.database[sessionHash] != undefined) {
        delete this.database[sessionHash];
    }
}

exports.SessionServer = SessionServer;
exports.SessionStorage = SessionStorage;