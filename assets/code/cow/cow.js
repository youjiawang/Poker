cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.SpriteAtlas,
        pokerSmall: cc.SpriteAtlas,

        btReady: cc.Node,
        spineNode: cc.Node,
        pokeNode: [cc.Node],
        time: cc.Label,
        roomId: cc.Label
    },

    // use this for initialization room_enterbroadcast
    onLoad: function () {
        this.chat = {
            0: cc.find('Canvas/pos/my'),
            1: cc.find('Canvas/pos/other1'),
            2: cc.find('Canvas/pos/other2'),
            3: cc.find('Canvas/pos/other3'),
            4: cc.find('Canvas/pos/other4')
        }
        this.roomId.string = GameData.roomData.roomId
        this.data = R.clone(GameData.roomData)
        if (GameData.roomData) {
            let myChatId = this.data.users[GameData.uId].pos
            for (let i in this.data.users) {
                if (i == GameData.uId) continue
                let cChatId = (this.data.users[i].pos - myChatId + 5) % 5
                this.chat[cChatId].active = true
            }
        }


        net.on('room_enterbroadcast', (data) => {
            let curstate = GameData.roomData.status
            GameData.roomData = data
            let myChatId = this.data.users[GameData.uId].pos
            for (let i in this.data.users) {
                if (i == GameData.uId) continue
                let cChatId = (this.data.users[i].pos - myChatId + 5) % 5
                this.chat[cChatId].active = true
            }
            if (curstate == 0 && GameData.roomData.status == 1) {
                this.showStartAnim()
            }
        }, this)
        net.on('room_readybroadcast', (data) => {

        }, this)

        net.on('room_qzbroadcast', (data) => {

        },this)

        net.on('room_fapai_broadcast', (data) => {

        },this)
    },

    // called every frame, uncomment this function to activate update callback
    update: function () {
        let date = new Date()
        this.time.string = date.getHours() + ':' + date.getMinutes()

    },
    showCard(data) {
        cc.find('Canvas/pos/my/card').removeAllChildren()
        for (let k in data) {
            let card = new cc.Node()
            card.addComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame('pkc_' + data[k].value + '0' + (data[k].color + 1))
            card.setScale(0.8)
            card.parent = cc.find('Canvas/pos/my/card')
        }
    },
    showCard2(pos, data) {
        cc.find('Canvas/pos/other' + pos + '/card').removeAllChildren()
        for (let k in data) {
            let card = new cc.Node()
            card.addComponent(cc.Sprite).spriteFrame = this.pokerSmall.getSpriteFrame('pkc_s_' + data[k].value + '0' + (data[k].color + 1))
            card.setScale(0.8)
            card.parent = cc.find('Canvas/pos/other' + pos + '/card')
        }
    },
    showStart() {
        this.btReady.active = false
        net.send('Room_ready')
        cc.find('Canvas/pos/my/prepare').active = true
    },
    showPrepare(pos, b) {
        let myChatId = this.data.users[GameData.uId].pos
        let cChatId = (pos - myChatId + 5) % 5
        this.chat[cChatId].active = b
    },
    showStartAnim() {
        let snode = cc.find('start', this.spineNode)
        snode.active = true
        snode.getComponent('sp.Skeleton').setAnimation(0, 'start', false)
        snode.getComponent('sp.Skeleton').setCompleteListener(() => {
            snode.active = false
            this.showBanker()
        })
    },

    /**
     * 显示叫庄
     */
    showBanker() {
        cc.find('Canvas/banker').active = true
    },

    /**
     * 点击叫庄
     */
    hideBanker(e, s) {
        cc.find('Canvas/banker').active = false
        net.send('Room_qiangzhuang', { qiang: s })
    },
    onDestroy() {
        net.off('Room_ready', this)
        net.off('room_enterbroadcast', this)
    },
})