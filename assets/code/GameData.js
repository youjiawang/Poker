GameData.uId = null //当前UserId
GameData.userData = {} //存储主页暂存数据
GameData.roomData = {}

GameData.clearUserData = function() {
    GameData.userData = {}
}

GameData.clearData = function() {
    GameData.uId = null //当前UserId
    GameData.userData = {}
}