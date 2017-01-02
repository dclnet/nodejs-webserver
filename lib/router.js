function parse(path) {
    var arr = path.split('/');
    var info = {};
    
    info["module"] = (arr[1] !=undefined && arr[1]) ? arr[1] : '';

    info["action"] = (arr[2] !=undefined && arr[2]) ? arr[2] : '';

    return info;
}

exports.parse = parse;