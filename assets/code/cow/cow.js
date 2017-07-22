cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.SpriteAtlas,
        pokerSmall: cc.SpriteAtlas,
        sprQiang: cc.SpriteFrame,
        sprBuQiang: cc.SpriteFrame,

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
        this.data = GameData.roomData
        this.myChatId = this.data.users[GameData.uId].pos
        if (GameData.roomData) {
            for (let i in this.data.users) {
                // if (i == GameData.uId) continue
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                this.chat[cChatId].active = true
                this.showUserInfo(cChatId, i)
                this.showPrepare(cChatId, this.data.users[i].status)
            }
        }


        net.on('room_enterbroadcast', (data) => {
            this.data = data
            for (let i in this.data.users) {
                if (i == GameData.uId) continue
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                this.chat[cChatId].active = true
                this.showUserInfo(cChatId, i)
            }

        }, this)
        net.on('room_readybroadcast', (data) => {
            this.data = data
            let allReady = true
            for (let i in this.data.users) {
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                // this.chat[cChatId].status = true
                if (!this.data.users[i].status) allReady = false
                this.showPrepare(cChatId, this.data.users[i].status)
            }
            if (allReady && this.data.status) this.showStartAnim()
        }, this)

        net.on('room_qzbroadcast', (data) => {
            this.data = data
            let allQiangZhuang = true
            for (let i in this.data.users) {
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                // this.chat[cChatId].status = true
                if (!this.data.users[i].status) allQiangZhuang = false
                this.showBankerState(cChatId, this.data.users[i].status)
            }
        }, this)

        net.on('room_fapai_broadcast', (data) => {
        }, this)
    },

    // called every frame, uncomment this function to activate update callback
    update() {
        let date = new Date()
        this.time.string = date.getHours() + ':' + date.getMinutes()

    },

    showUserInfo(pos, name) {
        let infoNode = this.chat[pos].getChildByName('info')
        infoNode.getChildByName('name').getComponent(cc.Label).string = name
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
        this.chat[pos].getChildByName('prepare').active = b
    },
    showStartAnim() {
        for (let k in this.chat) this.showPrepare(k, false)
        let snode = cc.find('start', this.spineNode)
        snode.active = true
        snode.getComponent('sp.Skeleton').setAnimation(0, 'start', false)
        snode.getComponent('sp.Skeleton').setCompleteListener(() => {
            snode.active = false
            cc.find('Canvas/banker').active = true
        })
    },
    showBankerState(pos, b) {
        if (b) {
            this.chat[pos].getChildByName('prepare').active = true
            if (b == 1) this.chat[pos].getChildByName('prepare').getComponent(cc.Sprite).spriteFrame = this.sprQiang
            if (b == 2) this.chat[pos].getChildByName('prepare').getComponent(cc.Sprite).spriteFrame = this.sprBuQiang
        }
        else this.chat[pos].getChildByName('prepare').active = false
    },
    hideBanker(e, s) {
        cc.find('Canvas/banker').active = false
        net.send('Room_qiangzhuang', { qiang: s })
    },
    onDestroy() {
        net.off('Room_ready', this)
        net.off('room_enterbroadcast', this)
    },
})