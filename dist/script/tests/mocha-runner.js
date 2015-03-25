requirejs.config({
    /*baseUrl: '/script/tests/',*/
    shim: {
        'expect': {
            exports: 'expect'
        }
        /*,
         'mocha': {
         exports: 'mocha'
         },
         'Q': {
         exports: 'Q'
         }*/
    },
    paths: {
        'mocha': '/script/vendor/mocha',
        'expect': '/script/vendor/expect',
        'Q': '/script/vendor/q'/*,
         'tests': '/script/tests',
         'specs': '/script/tests/specs'*/
    }
});

define(function (require) {
    require('mocha');
    require('expect');
    require('Q');

    mocha.setup('bdd');

    require(['./specs/promise'], function () {
        mocha.run();
    });
});