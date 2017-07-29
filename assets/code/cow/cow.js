cc.Class({ 
    extends: cc.Component,

    properties: {
        poker: cc.SpriteAtlas,
        pokerSmall: cc.SpriteAtlas,
        gameAtlas: cc.SpriteAtlas,

        btReady: cc.Node,
        spineNode: cc.Node,
        pokeNode: [cc.Node],
        time: cc.Label,
        roomId: cc.Label,
        roomTime: cc.Label
    },

    onLoad: function () {
        this.chat = {
            0: cc.find('Canvas/pos/my'),
            1: cc.find('Canvas/pos/other1'),
            2: cc.find('Canvas/pos/other2'),
            3: cc.find('Canvas/pos/other3'),
            4: cc.find('Canvas/pos/other4')
        }
        this.roomId.string = GameData.roomData.roomId
        this.roomTime = GameData.roomData.time + ':' + GameData.roomData.allTime
        this.data = GameData.roomData
        this.myChatId = this.data.users[GameData.uId].pos
        if (GameData.roomData) {
            for (let i in this.data.users) {
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
            for (let i in this.data.users) {
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                this.showPrepare(cChatId, this.data.users[i].status)
            }
        }, this)
        net.on('room_fapai_broadcast', (data) => {
            this.data = data
            for (let i in this.data.users) {
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                if (cChatId == 0) this.showCard(cChatId, this.data.users[i].poker)
                else this.showCard(cChatId, 4)
                this.showPrepare(cChatId, false)
                cc.find('Canvas/banker').active = true
            }
            //this.showStartAnim()
        }, this)
        net.on('room_qzbroadcast', (data) => {
            this.data = data
            let cChatId = (this.data.users[this.data.zhuangid].pos - this.myChatId + 5) % 5
            this.showBankerState(cChatId, true)
            if (cChatId == 0) return
            cc.find('Canvas/call').active = true
        }, this)
        net.on('room_multiple', (data) => {
            this.data = data
            for (let i in this.data.users) {
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                if (this.data.users[i].multiple && this.data.zhuangid != i) this.showCallState(cChatId, this.data.users[i].multiple)
            }
        }, this)
        net.on('room_result', (data) => {
            for (let i in this.data.users) {
                let cChatId = (this.data.users[i].pos - this.myChatId + 5) % 5
                this.showCard(cChatId, data.users[i].poker)
                this.showNiu(cChatId, data.users[i].pokerType)
            }
            //判断是否结束
            GameData.roomData.time++
            this.roomTime = GameData.roomData.time + ':' + GameData.roomData.allTime
            setTimeout(() => {
                cc.find('Canvas/win/roundWin').true = true
                cc.find('Canvas/win/roundWin/Layout').removeAllChildren()
                for (let k in this.data.users) {
                    let node = new cc.Node()
                    let lb = node.addComponent(cc.Label)
                    lb.string = (k + '     ' + data.roomInfo.users[k].score)
                    node.parent = cc.find('Canvas/win/roundWin/Layout')
                }

            },1000)
            setTimeout(() => {
                cc.find('Canvas/win/roundWin').active = false
                if (GameData.roomData.time >= GameData.roomData.allTime) {
                    cc.director.loadScene('main')
                } else {
                    this.clearState()
                    net.send('room_ready')
                }
            }, 5000)
        }, this)
        net.on('room_mumultiplebroadcast', (data) => {
            this.data = data
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

    showCard(pos, data) {
        let sprpath = 'pkc_'
        let pokerA = this.poker
        let s = pos == 0 ? 0.8 : 0.6
        cc.find('card', this.chat[pos]).removeAllChildren()
        if (data instanceof Array)
            for (let k in data) {
                let card = new cc.Node()
                card.addComponent(cc.Sprite).spriteFrame = pokerA.getSpriteFrame(sprpath + (data[k].value + 1) + '0' + (data[k].color + 1))
                card.setScale(s)
                card.parent = cc.find('card', this.chat[pos])
            }
        else
            for (let k = 0; k < data; k++) {
                let card = new cc.Node()
                card.addComponent(cc.Sprite).spriteFrame = pokerA.getSpriteFrame('pkc_paimian0')
                card.setScale(s)
                card.parent = cc.find('card', this.chat[pos])
            }
    },
    showStart() {
        this.btReady.active = false
        net.send('room_ready')
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
        })
    },
    showBankerState(pos, b) {
        cc.find('Canvas/banker').active = false
        this.chat[pos].getChildByName('zhuang').active = b
    },
    hideBanker(e, s) {
        cc.find('Canvas/banker').active = false
        net.send('room_qiangzhuang', { qiang: s })
    },
    chickCall(e, s) {
        cc.find('Canvas/call').active = false
        net.send('room_multiple', { multiple: s })
    },
    showCallState(pos, data) {
        cc.find('Canvas/call').active = false
        this.chat[pos].getChildByName('fen').active = true
        if (data == 1) this.chat[pos].getChildByName('fen').getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame('Text_x1')
        else if (data == 2) this.chat[pos].getChildByName('fen').getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame('Text_x2')
        else if (data == 3) this.chat[pos].getChildByName('fen').getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame('Text_x3')
        else this.chat[pos].getChildByName('fen').active = false
    },
    showNiu(pos, data) {
        let niu = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 310, 414, 411, 412, 415, 413, 416, 417]
        this.chat[pos].getChildByName('niu').active = true
        this.chat[pos].getChildByName('niu').getComponent(cc.Sprite).spriteFrame = this.gameAtlas.getSpriteFrame('V2_Title_DNF_' + niu[data])
    },
    clearState() {
        for (let i in this.chat) {
            if (this.chat[i].active == false) continue
            this.chat[i].getChildByName('zhuang').active = false
            this.chat[i].getChildByName('fen').active = false
            this.chat[i].getChildByName('niu').active = false
            this.chat[i].getChildByName('card').removeAllChildren()
        }
        this.chat[0].getChildByName('prepare').active = true
    },
    onDestroy() {
        net.off('room_enterbroadcast', this)
        net.off('room_readybroadcast', this)
        net.off('room_fapai_broadcast', this)
        net.off('room_qzbroadcast', this)
        net.off('Room_multiple', this)
        net.off('room_result', this)
        net.off('room_mumultiplebroadcast', this)
    },
})