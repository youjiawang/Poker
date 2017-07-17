module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "globals": {
        "cc": true,
        "Editor": true,
        "Back": true,
        "Power2": true,
        "async": true,
        "StateMachine": true,
        "R": true,

        "shader": true,
        "vo": true,
        "net": true,
        "Res": true,
        "GameData": true,
        "tips": true,
        "Tips": true,
        "Public": true,

    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};