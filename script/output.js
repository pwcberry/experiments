(function (w, d) {
    var outputChamber,
        appendLine = function (s, cls) {
            var item = d.createElement('p');
            if (cls) {
                item.className = 'output ' + cls;
            }
            item.innerText = s;
            outputChamber.appendChild(item);
        }, appendCode = function (s) {
            var item = document.createElement('p');
            item.className = 'output dir';
            item.innerHTML = '<pre><code>' + s + '</code></pre>';
            outputChamber.appendChild(item);
        },
        log = function (s, a) {
            var index, args = [].slice.call(a, 1), argCount = args.length;
            if (typeof s != 'string') {
                s = s.toString();
            }
            if (s.indexOf('%') >= 0) {
                index = 0;
                s = s.replace(/%s/g, function (m) {
                    return index < argCount ? args[index++] : m;
                });
            } else if (argCount > 0) {
                s = s + ' ' + args.join(', ');
            }
            appendLine(s, 'log');
        },
        dir = function (o) {
            try {
                appendCode(JSON.stringify(o, null, 4), 'dir');
            } catch (e) {
                appendLine(e.message, 'error');
            }
        };

    d.addEventListener('DOMContentLoaded', function () {
        outputChamber = d.getElementById('Output-Chamber');
        if (!outputChamber) {
            outputChamber = document.createElement('div');
            outputChamber.id = 'Output-Chamber';
            document.body.appendChild(outputChamber);
        }
    });

    w.output = function (v) {
        if (typeof v == 'object') {
            dir(v);
        } else {
            log(v, arguments);
        }
    };

    w.addHtml = function (html) {
        var item = document.createElement('div');
        item.className = 'output html';
        item.innerHTML = html;
        outputChamber.appendChild(item);
    };

}(window, document));