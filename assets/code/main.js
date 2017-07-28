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
        joinbox: cc.Prefab,
        createbox: cc.Prefab
    },

    // use this for initialization
    onLoad() {
        // cc.director.setDisplayStats(true)
        cc.game.addPersistRootNode(this.node)

        net.on('Room_create', (data) => {
            cc.find('main/win').removeAllChildren()
            GameData.roomData = data
            this.node.active = false
            cc.director.loadScene('Cow')
        }, this)
        net.on('Room_enter', (data) => {
            cc.find('main/win').removeAllChildren()
            GameData.roomData = data
            this.node.active = false
            cc.director.loadScene('Cow')
        }, this)
        this.node.on('join', (e) => {
            cc.find('main/win').removeAllChildren()
            net.send('Room_enter', { 'roomId': e.detail })
        })
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onDestroy() {
        net.off('Room_create', this)
        net.off('Room_enter', this)
    },
    createRoom() {
        let win = cc.instantiate(this.createbox)
        win.parent = cc.find('main/win')
    },
    enterRoom() {
        let win = cc.instantiate(this.joinbox)
        win.parent = cc.find('main/win')
    },
    randomRoom() {

    }

})