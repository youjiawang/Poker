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
        this.room = { 'gameId': 1, 'types': { '1': 1, '2': 1, '3': 1 } }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    btClose() {
        this.node.destroy()
    },
    goRoom() {
        net.send('Room_create', this.room)
    },
    boxclick(t, s) {
        if (s == 'time1') this.room.types[1] = 1
        if (s == 'time2') this.room.types[1] = 2
        if (s == 'type1') this.room.types[2] = 1
        if (s == 'type2') this.room.types[2] = 2
        if (s == 'zhuang1') this.room.types[3] = 1
        if (s == 'zhuang2') this.room.types[3] = 2
        if (s == 'zhuang3') this.room.types[3] = 3
    }
})