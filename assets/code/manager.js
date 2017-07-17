cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        boolHttps: {
            default: false,
            tooltip: 'true则http为https,false Http则为http'
        },
        http: {
            default: '127.0.0.1:8080',
        },
        webSocket: {
            default: '127.0.0.1:8080',
        },
        netMask: cc.Prefab,
    },

    // use this for initialization
    onLoad() {
        cc.director.setDisplayStats(true)
        if (this.boolHttps == false) this.http = 'http://' + this.http
        else this.http = 'https://' + this.http
        this.webSocket = 'ws://' + this.webSocket
        net.config.httpURL = this.http
        net.config.webSocketURL = this.webSocket
        cc.game.addPersistRootNode(this.node)
        Res.headAtlas = this.headAtlas
        Res.commonAtlas = this.commonAtlas
        Res.itemHead = this.itemHead
        net.mask = this.netMask
        net.ws()
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
})