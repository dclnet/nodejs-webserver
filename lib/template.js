var fs = require('fs');

function render(path, data) {
    if (fs.existsSync(path)) {
        var content = fs.readFileSync(path);
        if (content) {
            return _parseHtml(content.toString(), data);
        }
    }
    return '';
}

function _parseHtml(content, data) {
    for(var key in data) {
        content = content.replace("{{"+key+"}}", data[key]);
    }
    return content;
}

exports.render = render;