/*jslint node: true */
'use strict';

var $ = require('jquery');

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
    }

    Visualizer.prototype.setCharAt = function (row, col, value) {
        var $cell = this.table[row][col];
        $cell.html(value);
    };

    Visualizer.prototype.redisplay = function (buffer) {
        var i, j, $cell, character, that = this;

        for (i = 0; i < this.rows; i += 1) {
            for (j = 0; j < this.cols; j += 1) {
                character = buffer.readAt(i * this.rows + j);

                if (character === '\n' || character === '\r') {
                    i += 1;
                    j = 0;
                } else if (character === '\t') {
                    this.setCharAt(i, j, ' ');
                    this.setCharAt(i, j + 1, ' ');
                    this.setCharAt(i, j + 2, ' ');
                    this.setCharAt(i, j + 3, ' ');
                    j += 3;
                } else {
                    this.setCharAt(i, j, character);
                }
            }
        }
    };

    return Visualizer;
}());
