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

module.exports = function () {
    var actions, commands = [
        ['git branch -D gh-pages', 'Removing branch "gh-pages"...'],
        ['git branch gh-pages', 'Adding branch "gh-pages"...'],
        ['git rebase master gh-pages', 'Merging changes into "gh-pages"...'],
        ['rm *.*', 'Removing unnecessary files and folders...'],
        ['cp -r dist/* .', 'Copying application files into place...'],
        ['rm -rf dist', 'Removing "dist" folder...'],
        ['git add --all .', 'Adding changes to repo...'],
        ['git commit -m "Pages Made"', 'Committing to repo...']
    ];

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
