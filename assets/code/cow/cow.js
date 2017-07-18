cc.Class({
    extends: cc.Component,

    properties: {
        poker: cc.SpriteAtlas,
        pokerSmall: cc.SpriteAtlas,

        btReady: cc.Node,
        spineNode: cc.Node,
        pokeNode: [cc.Node]
    },

    // use this for initialization
    onLoad: function() {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
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
        let snode = cc.find('start', this.spineNode)
        snode.active = true
        snode.getComponent('sp.Skeleton').setAnimation(0, 'start', false)
        snode.getComponent('sp.Skeleton').setCompleteListener(() => {
            snode.active = false
            let data = [{ color: 0, value: 1 },
                { color: 0, value: 3 },
                { color: 0, value: 6 },
                { color: 0, value: 9 },
            ]
            this.showCard(data)
        })
    },
})