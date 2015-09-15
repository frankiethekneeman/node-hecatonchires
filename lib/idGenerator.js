var characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomPos() {
    return Math.floor(Math.random * characters.length);
}

function randomChar() {
    return characters.charAt(randomPos());
}

function randomString(length) {
    var toReturn = '';
}
