/*
    Observations:

    * Mocha will only return duration of tests, in milliseconds, if the test involves asynchrony such as "setTimeout"
    * Small "Q" promise chains are preferred for each Mocha step
    * Passing data from each proceeding promise step into the next "then" is preferred to keep outer scope variables to a minimum
 */
define(['expect', 'Q'], function (expect, Q) {
    'use strict';

    describe('A simple require.js and promise test', function () {

        it('should import "expect"', function () {
            if (typeof expect !== 'function') {
                throw '"Expect" not defined';
            }
        });

        it('should import "q"', function () {
            if (typeof Q !== 'function') {
                throw '"q" not defined';
            }
        });

        it('should include "q" extension for mocha', function () {
            var p = new Q();
            expect(p.end).to.be.a('function');
        });
    });

    describe('A "q" promise', function () {
        it('will timeout after 100 milliseconds', function (done) {
            return Q.promise(function (resolve) {
                setTimeout(function () {
                    resolve({age: 42});
                }, 100);
            })
                .then(function (data) {
                    expect(data.age).to.be(42);
                })
                .end(done);
        });

        describe('with #start()', function () {


            it('will return a promise', function (done) {
                return Q
                    .start(function () {
                        // This will resolve straight away and return a promise
                        return {age: 42};
                    })
                    .then(function (data) {
                        expect(data.age).to.be(42);
                    })
                    .end(done);
            });

            describe('and with one nested promise', function () {
                it('when the promise is resolved, the data will pass to the original promise chain', function (done) {
                    return Q
                        .start(function () {
                            return Q.promise(function (resolve) {
                                setTimeout(function () {
                                    resolve({age: 42});
                                }, 100);
                            });
                        })
                        .then(function (data) {
                            expect(data.age).to.be(42);
                        })
                        .end(done);
                });

                it('when the promise is resolved, the data will not be available to the original promise chain', function (done) {
                    return Q
                        .start(function () {
                            Q.promise(function (resolve) {
                                setTimeout(function () {
                                    resolve({age: 42});
                                }, 100);
                            });
                        })
                        .then(function (data) {
                            expect(data).to.be(undefined);
                        })
                        .end(done);
                });
            });
        });
    });
});