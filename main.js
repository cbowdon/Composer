/*jslint node: true, browser: true */

var KeyHandler  = require('./key-handler').KeyHandler,
    Visualizer  = require('./visualizer').Visualizer,
    Composer    = require('./composer').Composer;

(function Main() {
    var keyHandler  = new KeyHandler(),
        visualizer  = new Visualizer(),
        composer    = new Composer();

    // subscribe composer to key presses
    keyHandler.addEventListener('input', function (keyEvent) {
        composer.input(keyEvent);
    });

    // subscribe visualizer to buffer changes
    composer.addEventListener('bufferchange', function (bufferEvent) {
        visualizer.redisplay(bufferEvent);
    });

}());
