var fs = require('fs')
    ;

function FileManager(path) {
    this.path = path;
};

FileManager.prototype = {
    fd: null
    , path: null
    , open: function(callback) {
        var ths = this;
        fs.open(this.path, 'a+', function(err, fd) {
            ths.fd = fd || null;
            callback(err, fd);
        });
    }
    , getFD: function(callback) {
        if (this.fd == null) {
            this.open(callback);
        } else {
            var ths = this;
            fs.stat(this.path, function(err, stats) {
                if (err) {
                    ths.open(callback);
                } else {
                    callback(null, ths.fd);
                }
            });
        }
    }
    , write: function(toWrite, callback) {
        this.getFD(function(err, fd) {
            if (err) {
                console.error(err);
            } else {
                fs.write(fd, toWrite, true, "utf8", callback);
            }
        });
    }
    , writeLine: function(toWrite, callback) {
        this.write(toWrite + '\n', callback);
    }
};
module.exports = exports = FileManager;
