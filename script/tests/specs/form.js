define(['expect', 'Q', 'browser'], function (expect, Q, browser) {
    'use strict';

    describe('Given the user requests a page', function () {
        it('and the browser opens a location', function(done) {
           return Q
               .start(function () {
                   return browser.openWindow('http://localhost:12000/mocha/form.html');
               })
               .then(function(frame) {
                  expect(frame.top).to.be(window);
                   expect(frame.location.href).to.equal('http://localhost:12000/mocha/form.html');
               })
               .end(done);
        });
    })

});