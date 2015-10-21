(function (W) {
    'use strict';

    let pb = (W.PB || (W.PB = {}));

    let measurePerformance = (function () {
        var durationLabel,
            startLabel,
            finishLabel;

        //use a global variable with falsy/truthy value for storing the state

        function initLabels(label) {
            durationLabel = 'duration-' + label;
            startLabel = 'start-' + label;
            finishLabel = 'finish-' + label;
        }

        function clearMarks(label) {
            initLabels(label);
            window.top.performance.clearMarks(startLabel);
            window.top.performance.clearMarks(finishLabel);
        }

        function clearMeasures(label) {
            if (!window.top.PB.isSwitchedOn) {
                return;
            }
            initLabels(label);
            window.top.performance.clearMeasures(durationLabel);
        }

        function start(label) {
            if (!window.top.PB.isSwitchedOn) {
                return;
            }
            initLabels(label);
            clearMarks(label);
            console.info('%s starts', label);
            window.top.performance.mark(startLabel);
        }

        function finish(label) {
            if (!window.top.PB.isSwitchedOn) {
                return;
            }
            initLabels(label);
            window.top.performance.mark(finishLabel);
            window.top.performance.measure(durationLabel, startLabel, finishLabel);
        }

        function log(label) {
            if (!window.top.PB.isSwitchedOn) {
                return;
            }
            var i = 0, length, measures;
            initLabels(label);
            measures = window.top.performance.getEntriesByName(durationLabel);
            length = measures.length;
            for (i; i < length; i += 1) {
                console.info('%d. %s: %s ms', i + 1, label, measures[i].duration);
            }
        }

        function switchOn() {
            window.top.PB.isSwitchedOn = true;
        }

        function switchOff() {
            window.top.PB.isSwitchedOn = false;
        }

        return {
            start: start,
            finish: finish,
            log: log,
            clear: clearMeasures,
            enable: switchOn,
            disable: switchOff
        };
    }());

    Object.defineProperty(pb, "performance", {
        get: function () {
            return measurePerformance;
        }
    });

}(window));
