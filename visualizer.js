/*jslint node: true */
'use strict';

var $       = require('jquery'),
    Framer  = require('./frame').Framer;

module.exports.Visualizer = (function VisualizerClosure() {

    function buildTable(rows, cols) {
        var i, j, $row, $cell, $tbody, table;

        table = [];

        $('document').ready(function () {
            $tbody = $('<table><tbody></tbody></table>');

            for (i = 0; i < rows; i += 1) {
                table[i] = [];
                $row = $('<tr id="r' + i + '" class="line"></tr>');
                for (j = 0; j < cols; j += 1) {
                    $cell = $('<td id="r' + i + 'c' + j + '" class="col"></td>');
                    $row.append($cell);
                    table[i][j] = $cell;
                }
                $tbody.append($row);
            }

            $('body').append($tbody);
        });

        return table;
    }

    function Visualizer(nRows, nCols) {
        this.rows = nRows || 40;
        this.cols = nCols || 40;
        this.table = buildTable(this.rows, this.cols);
        this.framer = new Framer(nRows, nCols, 4);
    }

    Visualizer.prototype.redisplay = function (buffer) {
        var row, col, $cell, frame, result;

        frame = this.framer.frame(buffer);

        for (row = 0; row < this.rows; row += 1) {
            for (col = 0; col < this.cols; col += 1) {
                result = frame.next();
                if (result.done) {
                    break;
                }
                $cell = this.table[row][col];
                $cell.html(result.value || ' ');
            }
        }
    };

    return Visualizer;
}());
