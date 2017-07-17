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
    },

    // use this for initialization
    onLoad() {
        cc.director.setDisplayStats(true)
        net.on('User_init', (data) => {
            cc.log('----')
            cc.log(data)
        }, this)
        net.on('Room_create', (data) => {
            cc.log('----')
            cc.log(data)
        }, this)
        net.on('Room_enter', (data) => {
            cc.log('----')
            cc.log(data)
        }, this)
        net.send('User_init')
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    onDestroy() {
        net.off('User_init', this)
        net.off('Room_create', this)
        net.off('Room_enter', this)
    },
    createRoom() {
        net.send('Room_create', { 'gameId': 1, 'types': { '1': 1, '2': 1, '3': 2 } })
    },
    enterRoom() {
        net.send('Room_enter', { 'roomId': 1 })
    },
    randomRoom() {

    }

})