/*jslint node: true */
'use strict';

var $               = require('jquery'),
    KeyHandler      = require('./key-handler').KeyHandler,
    CanvasDisplay   = require('./canvas-display').CanvasDisplay,
    Composer        = require('./composer').Composer;

var test = "Hello,\nworld,\n\nhow's it going?\nAll's well,\nI trust.";

(function Main() {
    var keyHandler  = new KeyHandler(),
        display     = new CanvasDisplay(100, 80),
        composer    = new Composer(test);

    // subscribe composer to key presses
    keyHandler.addEventListener('input', function (keyEvent) {
        composer.input(keyEvent);
    });

    // subscribe display to buffer changes
    composer.addEventListener('change', function (bufferEvent) {
        display.redisplay(bufferEvent);
    });

    composer.addEventListener('cursor', function (bufferEvent) {
        display.redisplay(bufferEvent);
    });

    $(function () {
        display.redisplay(composer.buffer);
    });
}());
