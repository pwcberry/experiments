/**
 * Q Promise abstraction methods to embellish test language.
 */
define(['Q'], function (Q) {
    'use strict';

    /**
    * Extend Q Promise with an end method that accepts Mocha's done().
    * Adds error handling hook to our promise chains to dump a more useful stack trace.
    * Includes a Q rejection handler to directly instruct Mocha of errors to bypass same-origin policy.
    * http://stackoverflow.com/questions/5913978/cryptic-script-error-reported-in-javascript-in-chrome-and-firefox
    */
    Object.getPrototypeOf(new Q()).end = function (mochaDone) {
        var mocha = window.mocha,
            onFulfilled,
            onRejected;

        // Call Mocha's done when the promise chain is fulfilled. Only call mochaDone when the promise passes.
        onFulfilled = function () {
            if (mochaDone) {
                mochaDone();
            }
        };

        // For any reason the promise chain could not be fulfilled, capture thrown errors here to prevent Q's flush from throwing them.
        // If Q's flush is allowed to throw the error, Mocha's window.onerror will throw a duplicate error with less information.
        onRejected = function (error) {
            try {
                // Synchronously instruct mocha instance to throw an error.
                mocha.throwError(error);
            } catch (e) {
                // Log for debugging accessibility.
                console.log(error.stack);
            }
        };

        this.done(onFulfilled, onRejected);
    };

    /**
    * @method
    * Begins a promise chain with the passed function.
    * @param {function} fn Function to begin the promise chain with.
    * @return {Promise} Q Promise wrapping the passed function.
    */
    Q.start = Q.fcall;

});