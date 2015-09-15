var hecatonchires = require('./index')
    , logger = new hecatonchires.logger()
    ;

console.log(logger);
for (var x = 1; x < 101; x++) 
    (function(x) {
        setTimeout(function() {
            logger.log('test', 'INFO', 'THIS IS A TEST MESSAGE ' + x);
            console.log(x);
        }, x * 1000);
    })(x);
