var fs = require('fs');
var template = require('../../lib/template');

function login(req, resp) {
    var post = req["post"];
    if (post && post["username"] == "admin" && post["password"] == "admin888") {
        this.session.setValue("logined", 1);
        this.session.setValue("visit_count", 1);
        this.session.setValue("login_username", "admin");
        resp.redirect("http://"+req["Host"]);
    }
    resp.out(template.render(__dirname + '/template/login.html', {username: "Guest"}));
}

function register() {

}

function logout(req, resp) {
    if (this.session.getValue('logined') == 1) {
        this.session.shutdown();
        resp.redirect("http://"+req["Host"]);
    }
}

exports.register = register;
exports.login = login;
exports.logout = logout;