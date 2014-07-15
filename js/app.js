/*jslint browser: true */
/*global $, randomColor, FastClick */

(function () {

    'use strict';

    var $board = $('.board'),
        $timer = $('.timer'),
        timerInterval = null,
        transitionTimeout = null,
        $pieces;

    function populateBoard() {

        var pieces;

        pieces = randomColor({ count: 10, luminosity: 'light' });

        // Create two of each piece.
        pieces = pieces.concat(pieces);

        // Randomly sort pieces.
        pieces = pieces.sort(function () { return Math.random() - 0.5; });

        $board.empty();

        pieces.forEach(function (color) {

            var $piece = $('<div class="piece flipped" tabindex="0"></div>');

            $piece.append($('<div></div>').addClass('side front'));
            $piece.append($('<div><span>' + color + '</span></div>').addClass('side back').css({'background-color': color}));

            $board.append($piece);

        });

        $pieces = $('.piece');

        setTimeout(function () {

            $pieces.each(function (key) {

                $(this).delay(100 * key).queue(function (next) {
                    $(this).removeClass('flipped');
                    next();
                });

            });

        }, 500);

        clearInterval(timerInterval);

        $timer.attr('data-seconds', 0);

        $timer.html('00:00');

        timerInterval = setInterval(function () {

            var seconds = parseInt($timer.attr('data-seconds'), 10) + 1;

            $timer.attr('data-seconds', seconds);

            $timer.html(
                ('00' + Math.floor(seconds / 60)).slice(-2) + ':' + ('00' + (seconds % 60)).slice(-2)
            );

        }, 1000);

    }

    function handlePieceFlipped() {

        var $flipped = $board.find('.flipped');

        if ($flipped.length === 2) {

            if ($flipped.eq(0).find('.back').css('background-color') === $flipped.eq(1).find('.back').css('background-color')) {

                $flipped.addClass('matched');

            }

            $flipped.removeClass('flipped');

        }

    }

    function handlePieceFlip() {

        var $this = $(this),
            $flipped = $board.find('.flipped');

        if ($flipped.length > 1) {

            $flipped.removeClass('flipped');

        }

        if ($this.not('.matched')) {

            $this.addClass('flipped');

            clearTimeout(transitionTimeout);

            $flipped.off('webkitTransitionEnd');

            $this.on('webkitTransitionEnd', function () {

                clearTimeout(transitionTimeout);

                transitionTimeout = setTimeout(handlePieceFlipped, 200);

            });

        }

    }

    populateBoard();

    $('.new-game').on('click', populateBoard);

    $board.on('click', '.piece', handlePieceFlip);

    // Keyboard accesibility
    $board.on('keydown', '.piece', function (e) {

        if (e.keyCode === 13) {

            handlePieceFlip.call(this);

        } else if (e.keyCode === 37) { // Left

            $(this).prev('.piece').focus();

        } else if (e.keyCode === 38) { // Up

            $pieces.eq($(this).index() - 4).focus();

        } else if (e.keyCode === 39) { // Right

            $(this).next('.piece').focus();

        } else if (e.keyCode === 40) { // Down

            $pieces.eq($(this).index() + 4).focus();

        }

    });

    window.addEventListener('load', function () {
        new FastClick(document.body);
    }, false);

}());
