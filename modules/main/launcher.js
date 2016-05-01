var exec = require('child_process').spawn;

class Launcher
{
    launch(path) {
        exec(path, [], {
            detached: true
        });
    }
}

module.exports = new Launcher;
