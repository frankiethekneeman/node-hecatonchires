var Queue = require('./lib/queue')
    , idGenerator = require('./lib/idGenerator')
    , i = 0
    , stopped = false
    , timeout = null
    , rootFolder = process.env.HECATONCHIRES_LOG_DIR || './'
    ;

if (rootFolder.charAt(rootFolder.length - 1) != '/')
    rootFolder = rootFolder + '/';

var hecatonchires = {
    queues: {}
    , log: function(type, id, level, message) {
        var queue = this.queues[type] = this.queues[type] || new Queue(rootFolder + type.toLowerCase() + '.log');
        queue.enqueue(id, level, message);
        this.waiting++;
        if (!timeout) {
            timeout = setTimeout(next, 0);
        }
    }
    , write: function(type, callback) {
        var queue = this.queues[type];
        if (queue && queue.waitingEntries.length) {
            this.waiting--;
            queue.consume(callback);
        } else {
            process.nextTick(callback);
        }
    }
    , types: function() {
        return Object.keys(this.queues);
    }
    , waiting: 0
    , logger: function() {
        this.id = idGenerator();
        this.log = function(type, level, message) {
            hecatonchires.log(type, this.id, level, message);
        };
        this.types = function() {
            return hecatonchires.types();
        };
    }
    , stop: function() {
        if (stopped) return;
        stopped = true;
        if (timeout) clearTimeout(timeout);
    }
    , start: function() {
        if (!stopped) return;
        stopped = false;
        timeout = setTimeout(next, 0);
    }
};

function next() {
    if (stopped) return;
    var types = hecatonchires.types();
    if (types.length < 1) {
        return;
    } else {
        hecatonchires.write(types[i], function() {
            i = (i + 1) % types.length;
            timeout = hecatonchires.waiting ? setTimeout(next, 0) : null;
        });
    }
};

module.exports = exports = hecatonchires;

