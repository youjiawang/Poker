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
        lbedit: cc.EditBox
    },

    // use this for initialization
    onLoad() {
        net.on('User_init', () => {
            cc.director.loadScene('main')
        }, this)
    },

    // called every frame, uncomment this function to activate update callback
    // update (dt) {

    // },
    onDestroy() {
        net.off('User_init', this)
    },

    btlogin() {
        if (this.lbedit.string == '') return
        GameData.uId = this.lbedit.string
        net.send('User_init')
    }
})