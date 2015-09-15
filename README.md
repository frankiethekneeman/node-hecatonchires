# [HECATONCHIRES](https://en.wikipedia.org/wiki/Hekatonkheires)

Logging sucks.  It gets in the way of fast responses and forces you to dig through and deal with
file APIs and other nonsense.  Don't do that - do this instead.

## API

To quickly log some information to a useful file:

    require('hecatonchires').log("debug", null, "INFO", "I'm Mr. Meeseeks, look at me!");
 
You can keep like things identifiable in the logs with identifiers:

    require('hecatonchires').log("debug", "Beth", "INFO", "Horse Surgeons are just as valuable as regular surgeons");

For later references, that's:

    log(type, id, level, message);

Have tons of different things being operated on in highly asynchronouse fashion?  Of course you do!

    request.logger = new require('hecatonchires').logger();

... Elsewhere...

    request.logger.log("error", "WARNING", "Oh man, Rick! I'm looking around this place and I'm starting to work up some anxiety about this whole thing!"

... In yet another place...

    request.logger.log("unexpected", "CRITICAL ERROR", "HOLY CRAP, MORTY, RUN!")

Loggers will generate their own ID and keep to it.

Stop all logging behaviour with 

    require('hecatonchires').stop();

But all those logs will build up in memory.  Try to write them all later with

    require('hecatonchires').start();

## Behaviour

Each message will be placed in `<type>.log`, prefixed with the date at which it was logged, its ID,
and the level at which it was logged.

You can configure the directory in which the logs are stored by setting `HECATONCHIRES_LOG_DIR` in your 
environment.

You can configure the length of the random ID in which the logs are stored by setting `HECATONCHIRES_ID_LENGTH`
in your environment.

## Dropping

Logs will be dropped if the logger falls too far behind because your server is overworked based on 
their level.  `INFO` level logs will be dropped most aggressively, followed by `WARNING`, `ERROR`, 
and in extreme cases, `CRITICAL ERROR`.  Unrecognized levels can be logged, but they will be dropped
as if they were `INFO` level.

To stop dropping behaviour, set `HECTONCHIRES_NEVER_DROP` to a truthy value.
