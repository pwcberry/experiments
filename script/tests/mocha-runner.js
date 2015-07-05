/*
    # Hints:

    ## requirejs.config

    "baseUrl" specifies what is the default URL base for scripts. Usually it's the same as the script
    specified in the "data-main" attribute.

    "shim" is used to allow "global" vendor libraries to be exported into a module definition.


 */
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
        'Q': '/script/vendor/q',
        'browser': '/script/browser'
    /*
         'tests': '/script/tests',
         'specs': '/script/tests/specs'*/
    }
});

define(function (require) {
    require('mocha');
    require('expect');
    require('Q');
    require('/script/vendor/q-extension.js');

    mocha.setup('bdd');

    require(['./specs/promise', './specs/form'], function () {
        mocha.run();
    });
});