/*jslint node: true, browser: true */
'use strict';

var KeyHandler  = require('./key-handler').KeyHandler,
    TableDisplay  = require('./table-display').TableDisplay,
    Composer    = require('./composer').Composer;

(function Main() {
    var keyHandler  = new KeyHandler(document),
        visplay  = new TableDisplay(100, 80),
        composer    = new Composer();

    // subscribe composer to key presses
    keyHandler.addEventListener('input', function (keyEvent) {
        composer.input(keyEvent);
    });

    // subscribe visplay to buffer changes
    composer.addEventListener('change', function (bufferEvent) {
        visplay.redisplay(bufferEvent);
    });

}());
