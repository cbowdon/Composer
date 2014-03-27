/*jslint node: true */
'use strict';

var $ = require('jquery');

module.exports.Visualizer = (function VisualizerClosure() {
    function Visualizer(rows, cols) {
        var $body = $('body'),
            $table = $('<table></table>'),
            $row, i, j;

        for (i = 0; i < rows; i += 1) {
            $row = $('<tr id="r' + i + '"></tr>');
            for (j = 0; j < cols; j += 1) {
                $row.append('<tr id="r' + i + 'c' + j + '"></td>');
            }
            $table.append($row);
        }

        $body.append($table);
    }

    Visualizer.prototype.redisplay = function (buffer) {

    };

    return Visualizer;
}());
