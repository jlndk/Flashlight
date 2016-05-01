
class KeyboardHandler
{
    constructor() {
        this._defineVariables();
    }

    register(shortcut, callback, opts) {
        if(shortcut == undefined) throw new Error("Must set Shortcut");
        this.shortcut = shortcut;

        //@TODO: merge opts with default

        try {
            this.evt = this.globalShortcut.register(shortcut, () => {
                this.EventEmitter.emit('shotcut-pressed');
            });

            if (!this.evt) {
                throw new Error('Could not register global keyboard shortcut');
            }

        }
        catch(e) {
            this.unregister();
            throw e;
        }

    }

    unregister() {
        // Unregister a shortcut.
        this.globalShortcut.unregister(this.shortcut);

        // Unregister all shortcuts.
        this.globalShortcut.unregisterAll();

        //Unset global shortcut
        this.evt = null;
    }

    _defineVariables() {
        // Main electron module, containing all default submodules
        this.electron = require('electron');

        //Module to listen for global key shortcuts
        this.globalShortcut = this.electron.globalShortcut;

        this.Events = require('events');
        this.EventEmitter = new this.Events.EventEmitter();

        this.shortcut = '';
    }
}

module.exports = new KeyboardHandler;
