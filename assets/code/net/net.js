var netcfg = require('netConfig')
var httpClass = require('netHttp')

/**
 * 
 */
net.getURL = function(url, cb) {
    var http = new httpClass()
    netcfg.httpCache.push(http)
    http.url = url
    if (cb != null && cb != undefined) http.callBack = cb
    http.get()
}

/**
 * 
 */
net.postURL = function(url, sdata, cb) {
    var http = new httpClass()
    netcfg.httpCache.push(http)
    http.url = url
    if (cb != null && cb != undefined) http.callBack = cb
    http.post(sdata)
}

/**
 * 调用manager配置的服务器地址
 */
net.get = function(className, methodName, data, cb) {
    //g_loginServerHttp + "?class=ServerList&method=get&params={\"plat\":10000,\"pUid\":1}"; 参考海贼
    var url = netcfg.httpURL + '?class=' + className + '&method=' + methodName + '&params=' + JSON.stringify(data)
    net.getURL(url, cb)
}

/**
 * 调用manager配置的服务器地址
 */
net.post = function(className, methodName, data, cb) {
    var url = netcfg.httpURL + '?class=' + className + '&method=' + methodName
    net.postURL(url, data, cb)

}