define(['Q'], function (Q) {
    return {
        get frame() {
            return window.frames['Output'];
        },

        openWindow: function (url) {
            var me = this;
            return Q
                .Promise(function (resolve, reject) {
                    var win = me.frame,
                        windowLoaded = function() {
                            resolve(win);
                        };

                    win.location.href = url;

                    try {
                        /*if (typeof win.addEventListener === 'function') {
                            // window object API is available; has the document fired the DOMContentLoaded event?
                            *//*if (win.document) {
                                console.log('Document is ready');
                                // If event handler has been attached to window load,
                                // this will resolve the promise before the handler executes.
                                windowLoaded();
                            } else {
                                console.log("Add load event listener");
                                win.addEventListener('load', windowLoaded);
                            }*//*
                            //win.addEventListener('load', windowLoaded);
                            win.document.addEventListener('DOMContentLoaded', function () {
                               windowLoaded();
                            });
                        } else {
                            console.log("Call windowLoaded after timeout");
                            setTimeout(windowLoaded, 100);
                        }*/
                        console.log("Call windowLoaded after timeout");
                        setTimeout(windowLoaded, 500);
                    } catch(error) {
                        reject(error);
                    }
                })
                .fail(function(error) {
                    throw 'Could not open URL: "' + url + '" due to: ' + error.message;
                });
        }
    };
});
