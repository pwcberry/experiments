Ext.define('Ringtail.AjaxSiphon', (function () {
    'use strict';

    var ajaxInterceptor = (function () {

            var COMPLETED_READY_STATE = 4,
                RealXHRSend = XMLHttpRequest.prototype.send,
                requestCallbacks = [],
                responseCallbacks = [],
                wired = false;

            function arrayRemove(array, item) {
                var index = array.indexOf(item);
                if (index > -1) {
                    array.splice(index, 1);
                } else {
                    throw new Error("Could not remove " + item + " from array");
                }
            }


            function fireCallbacks(callbacks, xhr) {
                var i, j;
                for (i = 0, j = callbacks.length; i < j; i += 1) {
                    callbacks[i](xhr);
                }
            }

            function fireResponseCallbacksIfCompleted(xhr) {
                if (xhr.readyState === COMPLETED_READY_STATE) {
                    fireCallbacks(responseCallbacks, xhr);
                }
            }

            function proxifyOnReadyStateChange(xhr) {
                var realOnReadyStateChange = xhr.onreadystatechange;
                if (realOnReadyStateChange) {
                    xhr.onreadystatechange = function () {
                        fireResponseCallbacksIfCompleted(xhr);
                        realOnReadyStateChange();
                    };
                }
            }

            return {
                addRequestCallback: function (callback) {
                    requestCallbacks.push(callback);
                },
                removeRequestCallback: function (callback) {
                    arrayRemove(requestCallbacks, callback);
                },
                addResponseCallback: function (callback) {
                    responseCallbacks.push(callback);
                },
                removeResponseCallback: function (callback) {
                    arrayRemove(responseCallbacks, callback);
                },
                wire: function () {
                    if (wired) {
                        throw new Error("Ajax interceptor already wired");
                    }

                    // Override send method of all XHR requests
                    XMLHttpRequest.prototype.send = function () {

                        // Fire request callbacks before sending the request
                        fireCallbacks(requestCallbacks, this);

                        // Wire response callbacks
                        if (this.addEventListener) {
                            var self = this;
                            this.addEventListener("readystatechange", function () {
                                fireResponseCallbacksIfCompleted(self);
                            }, false);
                        } else {
                            proxifyOnReadyStateChange(this);
                        }

                        RealXHRSend.apply(this, arguments);
                    };
                    wired = true;
                },
                unwire: function () {
                    if (!wired) {
                        throw new Error("Ajax interceptor not currently wired");
                    }

                    XMLHttpRequest.prototype.send = RealXHRSend;
                    wired = false;
                }
            };

        }()),
        apiUrl = /((https?:)\/\/([\w\.:]+))*\/ringtail\/(\S+)$/i;

    function getStore() {
        var store, keys, data = localStorage.getItem('ajax-siphon');
        if (typeof data === 'string') {
            try {
                store = JSON.parse(data);
                keys = Object.keys(store);
                keys.forEach(function (k) {
                    if (k.indexOf('browser') >= 0 || k.indexOf('localhost') >= 0) {
                        delete store[k];
                    }
                });
            } catch (e) {
                console.error(e);
                store = {};
            }
        } else {
            store = {};
        }
        return store;
    }

    function mungePath(url) {
        var matchedUrl;
        url = url.replace(/_dc=\d+/ig, '');
        matchedUrl = apiUrl.exec(url);
        return matchedUrl !== null ? matchedUrl[4].replace(/\/*\?/, '_').replace(/&+/g, '_').replace(/\/+/g, '-').replace(/(?:\s+)/g, '').replace('.json', '') : url;
    }

    function saveResponse(store, xhr) {
        var key = mungePath(xhr.responseURL);
        store[key] = JSON.parse(xhr.responseText);
        localStorage.setItem('ajax-siphon', JSON.stringify(store));
        return key;
    }

    function writeToWindow(data) {
        Ext.create('Ext.window.Window', {
            title: 'Ajax Siphon Export',
            width: 600,
            height: 400,
            layout: 'fit',
            items: [{
                xtype: 'textareafield',
                width: 600,
                height: 400,
                readOnly: true,
                value: JSON.stringify(data, null , 4)
            }]
        }).show();
    }

    return {
        singleton: true,
        alternateClassName: 'PB.Siphon',
        wire: function () {
            var store = getStore();
            ajaxInterceptor.addResponseCallback(function (xhr) {
                var key;
                if (!((/browserLink|localhost\:\d+/i).test(xhr.responseURL))) {
                    key = saveResponse(store, xhr);
                    console.debug('ajax-siphon: "%s", "%s"', key, xhr.responseURL);
                }
            });
            ajaxInterceptor.wire();
        },
        unwire: function () {
            ajaxInterceptor.unwire();
        },
        "flush": function () {
            localStorage.removeItem('ajax-siphon');
        },
        "export": function (predicate) {
            var data, store = getStore(), type = typeof predicate;
            switch (type) {
                case 'string':
                    data = {};
                    predicate = predicate.toLowerCase();
                    Object.keys(store).filter(function (k) {
                        return k.toLowerCase().indexOf(predicate) >= 0;
                    }).forEach(function (k) {
                        data[k] = store[k];
                    });
                    break;
                case 'function':
                    data = {};
                    Object.keys(store).filter(predicate).forEach(function (k) { data[k] = store[k]; });
                    break;
                default:
                    data = store;
                    break;
            }
            writeToWindow(data);
        }
    };

}()));