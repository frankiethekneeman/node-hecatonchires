var Queue = require('./lib/queue')
    i = 0
    ;

var hecatonchires = {
    queues = {}
    , log: function(type, id, level, message) {
        var queue = this.queues[type] = this.queues[type] || new Queue(type.toLowerCase() + '.log');
        queue.enqueue(id, level, message);
    }
    , write: function(type, callback) {
        var queue = this.queues[type];
        if (queue) {
            queue.consume = 
        }
        
    }
    , types: function() {
        return Object.keys(this.queues);
    }
    , logger: function() {
        this.id =
    }
};
function next() {
    var types = hectonchires.types();
    if (types.length < 1) {
        setTimeout(next, 100);
    } else {
        hecatonchires.write(types[i], function() {
            i = (i + 1) % types.length;
            setTimeout(next,0);
        });
    }
};

module.exports = exports = hecatonchires;

process.nextTick(free);
