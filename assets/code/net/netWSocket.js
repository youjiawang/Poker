var socket = null
var events = {}
var onopen = function () {
    cc.log('WebSocket ::onopen')
    net.emit('onopen')
}

// var getConnected = function () {
//     return socket && socket.readyState == WebSocket.OPEN;
// };
var onmessage = function (evt) {
    //解包 string 转json
    var result = JSON.parse(decodeURI(evt.data))
    if (result.hasOwnProperty('method') != -1) {
        //派发事件
        if (result.result == 0 || result.result == undefined) {
            cc.log(result.method + ':')
            cc.log(result.info)
            net.emit(result.method, result.info)
            if (result.info instanceof String ||
                result.info instanceof Array) return
            for (let k in result.info) {
                net.emit(k, result.info[k])
            }
        } else {
            cc.log(result.method + ':')
            cc.log(result)

            //tips.show(result.msg)
        }
    }
}

var onerror = function () {
    cc.log('WebSocket ::onerror')
    net.emit('onerror')
    setTimeout(wsInit, 1000)
}

var onclose = function () {
    cc.log('WebSocket ::onclose')
    net.emit('onclose')
    setTimeout(wsInit, 1000)
}

var wsInit = function () {
    try {
        socket = new WebSocket(net.config.webSocketURL)
    } catch (error) {
        cc.log('ws init :')
        cc.log(error.message)
        return
    }
    socket.onopen = onopen
    socket.onmessage = onmessage
    socket.onerror = onerror
    socket.onclose = onclose
}

net.ws = wsInit
net.emit = function (type, data) {
    if (type == undefined || type == null) return
    if (events[type] == undefined || events[type] == null) return
    for (let k = 0; k < events[type].length; k++) {
        try {
            events[type][k].cb(data)
        } catch (error) {
            cc.log('net emit error:' + type)
            cc.log(error.message)
        }
    }

}
net.on = function (type, cb, target) {
    if (type == undefined || type == null) return
    if (cb == undefined || cb == null) return
    if (target != undefined) cb = cb.bind(target)
    if (events[type] == undefined || events[type] == null) events[type] = []
    events[type].push({ target: target, cb: cb })
}
net.off = function (type, target) {
    if (type == undefined || type == null) return
    if (events[type] == undefined || events[type] == null) return
    for (let k in events[type]) {
        if (events[type][k].target == target) events[type].splice(k, 1)
    }

}
net.send = function (type, data) {
    let arr = type.split('_')
    if (data == undefined || data == null) data = {}
    let sdata = { header: type, class: arr[0], method: arr[1], params: data }
    if (cc.sys.isMobile) {
        sdata.client = 'ios' //native need to compress,no need for web
    }
    // if (sdata.params.sessionId == undefined)
    //     sdata.params.sessionId = GameData.sessionId
    if (GameData.uId != undefined && GameData.uId != null)
        sdata.params.uId = GameData.uId
    // stackMessages.push(JSON.stringify(sdata));
    // cc.log(encodeURI(JSON.stringify(sdata)))
    socket.send((JSON.stringify(sdata)))
}