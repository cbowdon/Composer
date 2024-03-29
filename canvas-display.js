/*jslint node: true */
'use strict';

var $       = require('jquery'),
    Buffer  = require('./buffer').Buffer,
    lines   = require('./lib-base').lines;

exports.CanvasDisplay = (function CanvasDisplayClosure() {

    function buildContext(it, rows, cols, cellSize) {

        $(function () {
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
        this.cellSize = 12;
        buildContext(this, nRows, nCols, this.cellSize);
    }

    CanvasDisplay.prototype.redisplay = function (buffer) {
        var row, col, frame, result, x0, x1, y0, y1;

        if (!this.context) {
            return;
        }

        this.context.clearRect(0, 0,
                this.rows * this.cellSize,
                this.cols * this.cellSize);

        frame = lines(buffer);

        for (row = 0; row < this.rows; row += 1) {
            for (col = 0; col < this.cols; col += 1) {
                // row 0 doesn't show, for some reason
                x0 = col * this.cellSize;
                x1 = (col + 1) * this.cellSize;
                y0 = (row + 1) * this.cellSize;
                y1 = (row + 2) * this.cellSize;

                this.clearCell(x0, y0, x1, y1);

                if (!frame[row]) {
                    break;
                }
                result = frame[row][col];

                if (!result) {
                    break;
                }

                if (result.cursor) {
                    this.drawCursor(x0, y0);
                }

                // For debugging purposes, draw the null terminator as a tilde
                if (result.character === null) {
                    this.drawChar(x0, y0, '~');
                }

                if (result.character) {
                    this.drawChar(x0, y0, result.character);
                }
            }
        }
    };

    CanvasDisplay.prototype.clearCell = function (x0, y0, x1, y1) {
        this.context.clearRect(x0, y0, x1, y1);
    };

    CanvasDisplay.prototype.drawChar = function (x0, y0, character) {
        this.context.font = '12px Courier';
        this.context.fillStyle = '#000';
        this.context.fillText(character, x0, y0);
    };

    CanvasDisplay.prototype.drawCursor = function (x0, y0) {
        this.context.fillStyle = '#0A0';
        this.context.fillRect(x0, y0 - this.cellSize, 1, this.cellSize);
        this.context.fillRect(x0, y0, this.cellSize / 3, 2);
    };

    return CanvasDisplay;
}());

