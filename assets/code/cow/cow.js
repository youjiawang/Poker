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
    onLoad: function() {
        this.chat = {
            1: cc.find('Canvas/other1'),
            2: cc.find('Canvas/other2'),
            3: cc.find('Canvas/other3'),
            4: cc.find('Canvas/other4')
        }
        this.roomId.string = GameData.roomData.roomId
        this.data = R.clone(GameData.roomData)
        net.on('Room_ready', () => {

        }, this)
        net.on('room_enterbroadcast', (data) => {
            GameData.roomData = data
        }, this)
    },

    // called every frame, uncomment this function to activate update callback
    update: function() {
        let date = new Date()
        this.time.string = date.getHours() + ':' + date.getMinutes()
        if (!R.equals(this.data.users, GameData.roomData.users)) {
            this.data.users = R.clone(GameData.roomData.users)
            let myChatId = this.data.users[GameData.uId].pos
            for (let i in this.data.users) {
                if (i == GameData.uId) continue
                let cChatId = (this.data.users[i].pos - myChatId + 5) % 5
                this.chat[cChatId].active = true
            }
        }
    },
    showCard(data) {
        for (let k in data) {
            let card = new cc.Node()
            card.addComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame('pkc_' + data[k].value + '0' + (data[k].color + 1))
            card.setScale(0.8)
            card.parent = cc.find('Canvas/my/card')
            cc.log(k)
        }
    },
    showStart() {
        this.btReady.active = false
        net.send('Room_ready')
        cc.find('Canvas/my/prepare').active = true
    },
    showStartAnim() {
        let snode = cc.find('start', this.spineNode)
        snode.active = true
        snode.getComponent('sp.Skeleton').setAnimation(0, 'start', false)
        snode.getComponent('sp.Skeleton').setCompleteListener(() => {
            snode.active = false

            // let data = [{ color: 0, value: 1 },
            //     { color: 0, value: 3 },
            //     { color: 0, value: 6 },
            //     { color: 0, value: 9 },
            // ]
            // this.showCard(data)
        })
    },
    onDestroy() {
        net.off('Room_ready', this)
        net.off('room_enterbroadcast', this)
    },
})