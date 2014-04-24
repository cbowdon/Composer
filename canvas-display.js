/*jslint node: true */
'use strict';

var $       = require('jquery'),
    Framer  = require('./frame').Framer,
    Buffer  = require('./buffer').Buffer;

exports.CanvasDisplay = (function CanvasDisplayClosure() {

    function buildContext(it, rows, cols, cellSize) {

        $('document').ready(function () {
            var $canvas = $('<canvas>HTML5 Canvas not supported by your browser!</canvas>')
                .attr('width', rows * cellSize)
                .attr('height', cols * cellSize);

            $('body').append($canvas);

            it.context = $canvas.get(0).getContext('2d');
            it.context.font = '12px Courier';
            it.context.fillStyle = '#000';
        });
    }

    function CanvasDisplay(nRows, nCols) {
        this.rows = nRows || 40;
        this.cols = nCols || 40;
        this.framer = new Framer(nRows, nCols, 4);
        this.cellSize = 12;
        buildContext(this, nRows, nCols, this.cellSize);
    }

    CanvasDisplay.prototype.redisplay = function (buffer) {
        var row, col, frame, result, x0, x1, y0, y1;

        if (!this.context) {
            return;
        }

        this.context.clearRect(0, 0, this.rows * this.cellSize, this.cols * this.cellSize);

        frame = this.framer.frame(buffer);

        for (row = 0; row < this.rows; row += 1) {
            for (col = 0; col < this.cols; col += 1) {
                // row 0 doesn't show, for some reason
                x0 = col * this.cellSize;
                x1 = (col + 1) * this.cellSize;
                y0 = (row + 1) * this.cellSize;
                y1 = (row + 2) * this.cellSize;
                result = frame.next();

                if (result.done) {
                    break;
                }

                this.context.clearRect(x0, y0, x1, y1);
                if (result.value) {
                    this.context.fillText(result.value || ' ', x0, y0);
                }
            }
        }

    };

    return CanvasDisplay;
}());

