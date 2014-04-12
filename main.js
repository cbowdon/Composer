/*jslint node: true, browser: true */
'use strict';

var KeyHandler  = require('./key-handler').KeyHandler,
    CanvasDisplay  = require('./canvas-display').CanvasDisplay,
    Composer    = require('./composer').Composer;

(function Main() {
    var keyHandler  = new KeyHandler(document),
        display     = new CanvasDisplay(100, 80),
        composer    = new Composer();

    // subscribe composer to key presses
    keyHandler.addEventListener('input', function (keyEvent) {
        composer.input(keyEvent);
    });

    // subscribe visplay to buffer changes
    composer.addEventListener('change', function (bufferEvent) {
        display.redisplay(bufferEvent);
    });

}());
