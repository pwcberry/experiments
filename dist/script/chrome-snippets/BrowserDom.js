var BrowserDom = (function (window) {
    'use strict';

    function makeArray(collection) {
        return Array.prototype.slice.call(collection, 0);
    }

    /**
     * Query the DOM and UI components.
     *
     * @class BrowserDom
     */
    function BrowserDom(targetWindow) {
        //this.currentWindow = targetWindow || window;
        Object.defineProperty(this, 'currentWindow', {
            value: (targetWindow || window)
        });
    }

    BrowserDom.prototype = {
        /**
         * Selects child nodes of a given root based on the passed CSS selector.
         *
         * @param {String} selector The CSS selector.
         * @param {HTMLElement} [context] The DOM element that is the ancestor of the tree to search.
         * If it is not specified, the context becomes the document.
         * @return {HTMLElement[]} An Array of elements that match
         * the selector.  If there are no matches, an empty Array is returned.
         */
        selectElements: function (selector, context) {
            var win = this.currentWindow,
                elements = null;

            if (win) {
                // When no context defined assume document scope
                context = context || win.document;

                // Return DOM elements without being wrapped
                // in a jQuery object or Ext object
                elements = context.querySelectorAll(selector);

                // Return the NodeList as an array of nodes
                if (elements) {
                    elements = makeArray(elements);
                }
            }

            // undefined == null (type coercion)
            // elements.length will test if the property exists and return false if elements.length == 0
            return elements !== null && elements.length ? elements : [];
        },

        /**
         * Selects a DOM node by CSS selector.
         *
         * @param {String} selector The CSS selector.
         * @param {HTMLElement} [context] The DOM element that is the ancestor of the tree to search.
         * If it is not specified, the context becomes the document.
         * @return {HTMLElement} A DOM element or null if there are no matches.
         */
        selectElement: function (selector, context) {
            var win = this.currentWindow, element;

            if (win) {

                // Just matching an ID.
                // Slightly faster than relying on querySelector
                // and IDs are meant to be unique within a document.
                if (/^\#([\w\-]+)$/.test(selector)) {
                    return win.document.getElementById(selector.substr(1));
                }

                context = context || win.document;
                element = context.querySelector(selector);
                return element;
            }

            return null;
        },

        /**
         * Determine if an element is visible.
         *
         * @param {String} selector The CSS selector.
         * @param {HTMLElement} [context] The context of the DOM selection.
         * If it is not specified, the context becomes the document.
         * @return {Boolean}
         */
        isElementVisible: function (selector, context) {
            var result = false,
                element = this.selectElement(selector, context);

            if (element) {
                // Trick to determine visibility (learned from jQuery source code).
                // If either of the dimensions are greater than zero,
                // then the element is visible in the DOM.
                if ((element.offsetWidth || element.offsetHeight) > 0) {
                    result = true;
                }
            }

            return result;
        },

        /**
         * Returns an array of matched Components from within the passed root object.
         *
         * @param {String} selector The selector string to filter returned Components
         * @param {Ext.container.Container} [context] The Container within which to perform the query.
         * If omitted, all Components within the document are included in the search.
         * @return {Ext.Component[]} The matched Components.
         */
        selectComponents: function (selector, context) {
            var win = this.currentWindow,
                Ext = win.Ext;

            return (Ext && Ext.ComponentQuery) ?
                Ext.ComponentQuery.query(selector, context) :
                [];
        },

        /**
         * Returns a matched Component from within the passed root object.
         *
         * @param {String} selector The selector string to filter the Component
         * @param {Ext.container.Container} [context] The Container within which to perform the query.
         * If omitted, all Components within the document are included in the search.
         * @return {Ext.Component} The matched Component or null if not found.
         */
        selectComponent: function (selector, context) {
            var components = this.selectComponents(selector, context);

            return components.length ? components[0] : null;
        },

        /**
         * Determine if a component is visible.
         *
         * @param {String} selector The selector string to match a component.
         * @param {Ext.container.Container} [context] The Container within which to perform the query.
         * If omitted, all Components within the document are included in the search.
         * @return {Boolean}
         */
        isComponentVisible: function (selector, context) {
            var component = this.selectComponent(selector, context);

            return (component && component.isComponent) ?
                component.isVisible(true) :
                false;
        },

        /**
         * Create a jQuery object inside the execution window.
         * @param {String} selector The jQuery selector.
         * @param {(String|HTMLElement)} [context] The starting point for the search by jQuery.
         * If omitted, the context becomes the document.
         * When a string is specified, jQuery will perform a DOM search to match that selector.
         * @return {jQuery} The jQuery object or null if jQuery is not present during execution.
         */
        jQuery: function (selector, context) {
            var jQuery = this.currentWindow.jQuery;

            if (jQuery) {
                return !context ? jQuery(selector) : jQuery(selector, context);
            }

            return null;
        }
    };

    return BrowserDom;
}(window));