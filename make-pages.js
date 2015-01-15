var cp = require('child_process');

function addShellAction(command, next) {
    return function () {
        var shellCmd = cp.exec(command, function (err, stdout) {
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

module.exports = function () {
    var actions, commands = [
        'git branch -D gh-pages',
        'git branch gh-pages',
        'git rebase master gh-pages',
        'rm *.*',
        'cp -r dist/* .'
    ];

    commands.reverse().forEach(function (cmd, index) {
        if (index === 0) {
            actions = addShellAction(cmd);
        } else {
            actions = addShellAction(cmd, actions);
        }
    });

    if (typeof actions == 'function') {
        actions();
    }
};

/*
 ,
 'git add --all .',
 'git commit -m "Made pages"'
 */