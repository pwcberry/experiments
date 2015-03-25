define(['expect', 'Q'], function (expect, Q) {
    describe('This is a test', function () {
        it('This will work', function (done) {
            return Q
                .start(function() {
                    console.log('starting');
                })
                .then(function () {
                    expect(0).to.be(0);
                })
                .end(done);
        });
    });
});