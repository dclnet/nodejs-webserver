function parser(data) {
    var request = {
        Cookie: {}
    };
    var arr = data.split("\r\n\r\n");
    var head = arr[0];
    var post = arr[1];
    var get = '';

    head = head.split("\r\n");
    arr = head[0].split(' ');
    request['method'] = arr[0];
    request['query_string'] = arr[1];
    request['protocol'] = arr[2];
    get = arr[1] ? arr[1].match(/\?[^#]*/gi) : '';
    if (get && get[0] !== undefined) {
        get = get[0].replace('?', '');
    }
    request['path'] = (arr[1].match(/\/[^?]*/ig))[0];
    request['query_file'] = request['path'].substring(request['path'].lastIndexOf('/')+1, request['path'].length);

    var len = head.length;
    for(var i = 1; i < len; i++) {
        arr = (head[i]).split(':');
        if (arr[0] == 'Cookie') {
            var cookies = (arr[1].trim()).split(';');
            var cookieLen = cookies.length;
            var ckArr = [];
            for(var j = 0; j < cookieLen; j++) {
                ckArr = cookies[j].split('=');
                request['Cookie'][ckArr[0].trim()] = ckArr[1].trim();
            }
        } else if ((arr[0] == 'Host') && (arr[2] != undefined)) {
            request['Host'] = arr[1].trim();
            request['port'] = parseInt(arr[2]);
        } else {
            request[arr[0]] = arr[0] == 'Content-Length' ? parseInt(arr[1]) : arr[1].trim();
        }
    }
    if (post) {
        // 暂不支持get/post数组
        request['post'] = parseValues(post);
    }
    if (get) {
        request['get'] = parseValues(get);
    }

    return request;
}

function parseValues(str) {
    var data = {};
    var items = str.split("&");
    var len = items.length;
    var arr = [];
    for(var i = 0; i < len; i++) {
        arr = items[i].split("=");
        data[arr[0]] = arr[1];
    }
    /*
    function setValue(key, val) {
        var arr = (key.replace(/(\[|\]\[|\])/gi, ' ')).trim().split(' ');
        var len = arr.length;
        var temp = {};
        if (len == 1) {
            data[arr[0]] = val;
        } else {
            for(var i = 0; i < len; i++) {
            }

        }
    }
    */
    return data;
}


exports.parser = parser;