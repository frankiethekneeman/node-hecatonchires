var FileManager = require('./fileManager')
    , LinkedList = require('linkedlist')
    ;

function Queue(filename) {
    this.filename = filename;
    this.fileManager = new FileManager(filename);
    this.waitingEntries = new LinkedList();
};

Queue.prototype = {
    enqueue: function(id, level, message) {
        message = message + ""; // Convert to string.
        var pieces = message.split(/[\r\n]+/);
        for (var i = 0; i < pieces.length; i++) {
            this.waitingEntries.push( {
                message: pieces[i]
                , entered: new Date()
                , id: id
            })
        }
    }
};
module.exports = exports = Queue;
