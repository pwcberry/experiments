(function (Simulate) {
    /* This script only supports evergreen browsers and IE 11 */

    'use strict';

    /* Helpers */
    var isFunction = function (o) {
            return typeof o === 'function';
        },
        isString = function (o) {
            return typeof o === 'string';
        },
    /* Mix source object with another object */
        mix = function (source, mixer) {
            var result = {};
            Object.keys(source).forEach(function (key) {
                result[key] = source[key];
            });
            Object.keys(mixer).forEach(function (key) {
                result[key] = mixer[key];
            });
            return result;
        },

    /* Environment */
        isPointerSupported = (navigator.pointerEnabled !== undefined),
        isEventConstructorsSupported = isFunction(window.Event),

    /* Events */

        pointerEvents = {
            pointerdown: true,
            pointerup: true,
            pointermove: true,
            pointerover: true,
            pointerout: true,
            pointerenter: true,
            pointerleave: true
        },

        mouseEvents = {
            click: true,
            dblclick: true,
            mouseover: true,
            mouseout: true,
            mouseenter: true,
            mouseleave: true,
            mousedown: true,
            mouseup: true,
            mousemove: true
        },

        keyEvents = {
            keydown: true,
            keyup: true,
            keypress: true
        },

        uiEvents = {
            input: true,
            submit: true,
            blur: true,
            change: true,
            focus: true,
            resize: true,
            scroll: true,
            select: true
        },

    // UI Events that bubble
        bubbleEvents = {
            input: true,
            scroll: true,
            resize: true,
            submit: true,
            change: true,
            select: true
        },

    /* Default event options used for event initialization */

        defaultEventInit = {
            bubbles: true,
            cancelable: true
        },

        defaultUIEventInit = mix(defaultEventInit, {
            view: window,
            detail: 0
        }),

    // KeyEvent extends UIEvent
        defaultKeyEventInit = mix(defaultUIEventInit, {
            key: '',
            code: '',
            location: 0,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            repeat: false,
            isComposing: false,
            charCode: 0, /* optional, deprecated */
            keyCode: 0, /* optional, deprecated */
            which: 0 /* optional, deprecated */
        }),

    // MouseEvent extends UIEvent
        defaultMouseEventInit = mix(defaultUIEventInit, {
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            button: 0,
            buttons: 0,
            relatedTarget: null
        }),

    /* See: http://www.w3.org/TR/pointerevents/#pointer-events-and-interfaces */
        defaultPointerEventInit = mix(defaultMouseEventInit, {
            width: 0,
            height: 0,
            pressure: 0,
            tiltX: 0,
            tiltY: 0,
            pointerId: 0,
            pointerType: '',
            isPrimary: false
        }),

    /* Determine if the element is a hyperlink */
        isHyperlink = function (target) {
            var currentUrl, linkUrl,
                isLink = target.tagName.toLowerCase() === 'a' && target.hasAttribute('href') && target.href.length > 0;

            if (isLink) {
                // The "href" attribute, even if in the mark-up is assigned "#" (hash)
                // will include the current browser URL.
                // A hyperlink will navigate away from the current URL.
                currentUrl = window.location.href.split('#');
                linkUrl = target.href.split('#');

                return currentUrl[0] === linkUrl[0];
            }

            return false;
        };

    /**
     * Simulates a UI event using the given event information to populate
     * the generated event object.
     *
     * For further information about KeyboardEvent, see: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/UIEvent.
     */
    Simulate.uiEvent=function (target, type, options) {
        var eventInit = mix(defaultKeyEventInit, options),
            targetDoc = target.ownerDocument,
            customEvent;

        eventInit.bubbles = eventInit.bubbles && (bubbleEvents.hasOwnProperty(type)); // Not all events bubble
        eventInit.cancelable = (type === 'submit'); //  submit is the only one that can be cancelled

        if (isEventConstructorsSupported) {
            customEvent = new KeyboardEvent(type, eventInit);
        } else {
            customEvent = targetDoc.createEvent('UIEvent');
            customEvent.initUIEvent(type, eventInit.bubbles, eventInit.cancelable, eventInit.view, eventInit.detail);
        }

        target.dispatchEvent(customEvent);
    };

    /**
     * Simulates a key event using the given event information to populate
     * the generated event object.
     *
     * For further information about KeyboardEvent, see: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent.
     */
    Simulate.keyEvent=function(target, type, options) {
        var eventInit = mix(defaultKeyEventInit, options),
            targetDoc = target.ownerDocument,
            modifiers = [],
            customEvent;

        if (type === 'textevent') {
            // DOM Level 3
            type = 'keypress';
        }

        if (isEventConstructorsSupported) {
            customEvent = new KeyboardEvent(type, eventInit);
        } else {
            customEvent = targetDoc.createEvent('KeyboardEvent');

            if (eventInit.altKey) {
                modifiers.push('Alt');
            }

            if (eventInit.shiftKey) {
                modifiers.push('Shift');
            }

            if (eventInit.metaKey) {
                modifiers.push('Meta');
            }

            if (eventInit.ctrlKey) {
                modifiers.push('Control');
            }

            customEvent.initKeyboardEvent(type, eventInit.bubbles, eventInit.cancelable, eventInit.view, eventInit.key, eventInit.location, modifiers.join(' '), eventInit.repeat, eventInit.locale);
        }

        target.dispatchEvent(customEvent);
    };

    /**
     * Simulates a key event using the given event information to populate
     * the generated event object.
     *
     * For further information about MouseEvent, see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent.
     */
    Simulate.mouseEvent = function(target, type, options) {
        var eventInit = mix(defaultMouseEventInit, options),
            targetDoc = target.ownerDocument,
            customEvent;

        if (isEventConstructorsSupported) {
            customEvent = new MouseEvent(type, eventInit);
        } else {
            customEvent = targetDoc.createEvent('MouseEvent');
            customEvent.initMouseEvent(type, eventInit.bubbles, eventInit.cancelable, eventInit.view, eventInit.detail, eventInit.screenX, eventInit.screenY, eventInit.clientX, eventInit.clientY, eventInit.ctrlKey, eventInit.altKey, eventInit.shiftKey, eventInit.metaKey, eventInit.button, eventInit.relatedTarget);
        }

        target.dispatchEvent(customEvent);
    };

    /**
     * Simulates a pointer event using the given event information to populate
     * the generated event object.
     *
     * For further information about PointerEvent, see https://msdn.microsoft.com/en-us/library/ie/hh772103(v=vs.85).aspx.
     */
    Simulate.pointerEvent=function(target, type, options) {
        var eventInit = mix(defaultPointerEventInit, options),
            targetDoc = target.ownerDocument,
            customEvent;

        if (isEventConstructorsSupported) {
            customEvent = new PointerEvent(type, eventInit);
        } else {
            // These properties are not in the spec, but are needed for the initializer method.
            eventInit.offsetX = 0;
            eventInit.offsetY = 0;
            eventInit.timestamp = 0;

            customEvent = targetDoc.createEvent('PointerEvent');
            customEvent.initPointerEvent(type, eventInit.bubbles, eventInit.cancelable, eventInit.view, eventInit.detail,
                eventInit.screenX, eventInit.screenY, eventInit.clientX, eventInit.clientY,
                eventInit.ctrlKey, eventInit.altKey, eventInit.shiftKey, eventInit.metaKey, eventInit.button, eventInit.relatedTarget,
                eventInit.offsetX, eventInit.offsetY, eventInit.width, eventInit.height,
                eventInit.pressure, eventInit.rotation, eventInit.tiltX, eventInit.tiltY,
                eventInit.pointerId, eventInit.pointerType, eventInit.timestamp, eventInit.isPrimary);
        }

        target.dispatchEvent(customEvent);
    };

    /**
     * Simulates the event with the given name on a target.
     *
     * @param {DOMElement} target  The target for the given event.
     * @param {String} type The type of event to simulate (i.e., "click").
     * @param {Object} options (Optional) The initializer values for the event.
     * @param {Boolean} [options.bubbles=true] Set to true to indicate the event bubbles up the DOM tree.
     * @param {Boolean} [options.cancelable=true] Set to true to indicate the event can be cancelled.
     * @param {Window} [options.view=null] Sets the Window from which the event was generated.
     * @param {Number} [options.detail=0] Specifies some detail about the event.
     * @param {Number} [options.screenX=0] Sets the desired horizontal relative position of the mouse pointer on the screen. (MouseEvent, PointerEvent)
     * @param {Number} [options.screenY=0] Sets the desired vertical relative position of the mouse pointer on the screen. (MouseEvent, PointerEvent)
     * @param {Number} [options.clientX=0] Sets the desired horizontal position of the mouse pointer relative to the client window. (MouseEvent, PointerEvent)
     * @param {Number} [options.clientY=0] Sets the desired vertical position of the mouse pointer relative to the client window. (MouseEvent, PointerEvent)
     * @param {Number} [options.button=0] Sets the desired state of the button(s) of the mouse. (MouseEvent, PointerEvent)
     * @param {Number} [options.buttons=0] Specifies one or more of the button(s) of the mouse that are to be considered active. (MouseEvent, PointerEvent)
     * @param {DOMElement} [options.relatedTarget=null] Specifies the element whose bounds the mouse pointer just left, or the element whose bounds the mouse pointer is entering (MouseEvent, PointerEvent)
     * @param {Number} [options.width=0] Sets the width in CSS pixels of the contact geometry of the pointer. (PointerEvent)
     * @param {Number} [options.height=0] Sets the height in CSS pixels of the contact geometry of the pointer. (PointerEvent)
     * @param {Number} [options.pressure=0] Sets the normalized pressure of the pointer input in the range of [0,1]. (PointerEvent)
     * @param {Number} [options.tiltX=0] Sets the plane angle (in degrees, in the range of [-90,90]) between the Y-Z plane and the plane containing both the transducer (e.g. pen stylus) axis and the Y axis. (PointerEvent)
     * @param {Number} [options.tiltY=0] Sets the plane angle (in degrees, in the range of [-90,90]) between the X-Z plane and the plane containing both the transducer (e.g. pen stylus) axis and the X axis. (PointerEvent)
     * @param {Number} [options.pointerId=0] A unique identifier for the pointer causing the event. (PointerEvent)
     * @param {String} [options.pointerType=''] Set the device type that caused the event (mouse, pen, touch, etc.). (PointerEvent)
     * @param {Boolean} [options.isPrimary=false] Set to true to indicate the primary pointer of this pointer type. (PointerEvent)
     * @param {Boolean} [options.altKey=false] Set to true to indicate the 'Alt' key is active. (MouseEvent, PointerEvent, KeyboardEvent)
     * @param {Boolean} [options.ctrlKey=false] Set to true to indicate the 'Control' key is active. (MouseEvent, PointerEvent, KeyboardEvent)
     * @param {Boolean} [options.metaKey=false] Set to true to indicate the 'Meta' key modifier is active. (MouseEvent, PointerEvent, KeyboardEvent)
     * @param {Boolean} [options.shiftKey=false] Set to true to indicate the 'Shift' key is active. (MouseEvent, PointerEvent, KeyboardEvent)
     * @param {String} [options.code=''] Set the unicode character string that represents the key pressed without keyboard modifiers. (KeyboardEvent)
     * @param {String} [options.key=''] Set the unicode character string that represents the meaning of the key pressed including keyboard modifiers. (KeyboardEvent)
     * @param {Boolean} [options.repeat=false] Set to true to indicate that the key pressed is kept down for a period of time. (KeyboardEvent)
     * @param {Number} [options.location=0] Set the location of the key pressed according to the keyboard. (KeyboardEvent)
     * @param {Boolean} [options.isComposing=false] Set to true if the event is part of a composition sequence. (KeyboardEvent)
     */
    Simulate.event = function(target, type, options) {
        options = options || {};

        if (!isString(type)) {
            throw new Error('Event type not specified.');
        }

        type = type.toLowerCase();

        // If "target" is a hyperlink, then triggering "mousedown" and "mouseup" will not initiate navigation.
        // Must use the proper 'click' type for the MouseEvent in both Evergreen browsers and IE11 to trigger the hyperlink.
        // For other elements, or <a> tags not defined as hyperlinks, there may have additional attributes and handlers 
        // that have been applied by Ext or other JS frameworks.
        if (!isHyperlink(target) && type === 'click') {
            Simulate.event(target, 'mousedown', options);
            Simulate.event(target, 'mouseup', options);

            // If these events don't fire, then we'll fall back to creating a 'click' event.
        }

        if (isPointerSupported) {

            if (/^mouse/.test(type)) {
                options.pointerType = 'mouse';
            }

            switch (type) {
                case 'mousedown':
                    Simulate.pointerEvent(target, 'pointerdown', options);
                    return;
                case 'mouseup':
                    Simulate.pointerEvent(target, 'pointerup', options);
                    return;
                case 'mousemove':
                    Simulate.pointerEvent(target, 'pointermove', options);
                    return;
                case 'mouseover':
                    Simulate.pointerEvent(target, 'pointerover', options);
                    return;
                case 'mouseout':
                    Simulate.pointerEvent(target, 'pointerout', options);
                    return;
                case 'mouseenter':
                    Simulate.pointerEvent(target, 'pointerenter', options);
                    return;
                case 'mouseleave':
                    Simulate.pointerEvent(target, 'pointerleave', options);
                    return;
                default:
                    break;
            }
        }

        if (pointerEvents[type]) {
            Simulate.pointerEvent(target, type, options);
        } else if (mouseEvents[type]) {
            Simulate.mouseEvent(target, type, options);
        } else if (keyEvents[type]) {
            Simulate.keyEvent(target, type, options);
        } else if (uiEvents[type]) {
            Simulate.uiEvent(target, type, options);
        } else {
            throw new Error('The event type "' + type + '" is not supported.');
        }
    };

    Simulate.isPointerSupported = isPointerSupported;
    Simulate.isEventConstructorsSupported = isEventConstructorsSupported;

}((window.Simulate = {})));