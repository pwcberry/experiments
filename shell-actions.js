var cp = require('child_process');

function addShellAction(command, message, next) {
    return function () {
        var shellCmd;

        if (message) {
            console.log(message);
        }

        shellCmd = cp.exec(command, function (err, stdout) {
            if (!err) {
                // Show git output
                console.log(stdout);
            } else {
                // Display git or shell error
                console.error(err);
            }

            shellCmd.stdin.end();

            if (typeof next === 'function') {
                next();
            }
        });
    };
}

module.exports = function (commands) {
    var actions;

    if (!Array.isArray(commands)) {
        throw new TypeError('Expected "commands" argument to be an array.');
    }

    commands.reverse().forEach(function (cmd, index) {
        if (index === 0) {
            actions = addShellAction(cmd[0], cmd[1]);
        } else {
            actions = addShellAction(cmd[0], cmd[1], actions);
        }
    });

    if (typeof actions == 'function') {
        actions();
    }
};
