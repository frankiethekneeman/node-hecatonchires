var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    , defaultLength = 16;

function randomPos() {
    return Math.floor(Math.random * characters.length);
}

function randomChar() {
    return characters.charAt(randomPos());
}

function randomString(length) {
    var toReturn = '';
    for (var i = 0; i < length; i++)
        toReturn = toReturn + randomChar;
}

module.exports = exports = function() {
    return randomString((+process.env.HECATONCHIRES_ID_LENGTH) || 16)
}
