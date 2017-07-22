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
        this.str = ''
        this.strBuf = ''
        this.numArr = [
            cc.find('/num/0/num', this.node).getComponent(cc.Label),
            cc.find('/num/1/num', this.node).getComponent(cc.Label),
            cc.find('/num/2/num', this.node).getComponent(cc.Label),
            cc.find('/num/3/num', this.node).getComponent(cc.Label),
            cc.find('/num/4/num', this.node).getComponent(cc.Label),
            cc.find('/num/5/num', this.node).getComponent(cc.Label),
        ]

    },

    // called every frame, uncomment this function to activate update callback
    update: function() {
        if (this.str == this.strBuf) return
        this.str = this.strBuf
        for (let i in this.numArr) this.numArr[i].string = this.str.charAt(i)

    },
    btClose() {
        this.node.destroy()
    },
    clickNum(e, s) {
        if (s == 'clear') this.strBuf = ''
        else if (s == 'delete') this.strBuf = this.str.substring(0, this.str.length - 1)
        else this.strBuf += s
        if (this.strBuf.length == 6) {
            setTimeout(() => {
                let cus = new cc.Event.EventCustom('join', true)
                cus.detail = this.strBuf
                this.node.dispatchEvent(cus)
            }, 100)

        }
    }
})