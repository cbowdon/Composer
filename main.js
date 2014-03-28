/*jslint node: true, browser: true */
'use strict';

var KeyHandler  = require('./key-handler').KeyHandler,
    Visualizer  = require('./visualizer').Visualizer,
    Composer    = require('./composer').Composer;

(function Main() {
    var keyHandler  = new KeyHandler(document),
        visualizer  = new Visualizer(100, 80),
        composer    = new Composer();

    // subscribe composer to key presses
    keyHandler.addEventListener('input', function (keyEvent) {
        composer.input(keyEvent);
    });

    // subscribe visualizer to buffer changes
    composer.addEventListener('change', function (bufferEvent) {
        visualizer.redisplay(bufferEvent);
    });

}());
