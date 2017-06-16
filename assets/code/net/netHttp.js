var netcfg = require("netConfig");
cc.Class({
    extends: cc.Component,
    url: "",
    callBack: null,
    http: null,
    netMask: null,
    get: function () {
        var xhr = cc.loader.getXMLHttpRequest();
        this._on(xhr, "GET", this.url, this.callBack);
        xhr.open("GET", this.url, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        xhr.timeout = netcfg.timeout;// for timeout
        xhr.send();
        var canvas = cc.find('Canvas');
        this.netMask = cc.instantiate(netMask);
        this.netMask.parent = canvas;
    },
    post: function (data) {
        var xhr = cc.loader.getXMLHttpRequest();
        this._on(xhr, "POST", this.url, this.callBack);
        xhr.open("POST", this.url);
        xhr.setRequestHeader("Content-Type", "text/plain");
        xhr.send(JSON.stringify(data));
        var canvas = cc.find('Canvas');
        this.netMask = cc.instantiate(netMask);
        this.netMask.parent = canvas;
    },
    _on: function (xhr, math, url, cb) {
        ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
            xhr["on" + eventname] = function () {
                cc.log(math + "  " + eventname + ":" + url);
            };
        });
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                this.netMask.destroy();
                var data = JSON.parse(xhr.responseText);
                cc.log(data);
                if (cb != undefined && cb != null) cb(data);
                var mIndex = netcfg.httpCache.indexOf(this);
                netcfg.httpCache.splice(mIndex, 1);
            }
        };
    }
});
