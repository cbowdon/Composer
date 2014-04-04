/*jslint node: true */
'use strict';

var $ = require('jquery');

module.exports.Visualizer = (function VisualizerClosure() {

    function buildTable(rows, cols) {
        var i, j, $row, $tbody;

        $('document').ready(function () {
            $tbody = $('<table><tbody></tbody></table>');

            for (i = 0; i < rows; i += 1) {
                $row = $('<tr id="r' + i + '" class="line"></tr>');
                for (j = 0; j < cols; j += 1) {
                    $row.append('<td id="r' + i + 'c' + j + '" class="col"></td>');
                }
                $tbody.append($row);
            }

            $('body').append($tbody);
        });
    }

    function Visualizer(nRows, nCols) {
        this.rows = nRows || 40;
        this.cols = nCols || 40;

        buildTable(this.rows, this.cols);
    }

    Visualizer.prototype.redisplay = function (buffer) {
        var i, j, $cell, character;

        function setCell(row, col, value) {
            $cell = $('#r' + row + 'c' + col);
            $cell.html(value);
        }

        for (i = 0; i < this.rows; i += 1) {
            for (j = 0; j < this.cols; j += 1) {
                character = buffer.readAt(i * this.rows + j);

                if (character === '\n' || character === '\r') {
                    i += 1;
                    j = 0;
                } else if (character === '\t') {
                    setCell(i, j, ' ');
                    setCell(i, j + 1, ' ');
                    setCell(i, j + 2, ' ');
                    setCell(i, j + 3, ' ');
                    j += 3;
                } else {
                    setCell(i, j, character);
                }
            }
        }
    };

    return Visualizer;
}());
