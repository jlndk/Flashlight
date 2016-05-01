class AppIcon {
    constructor() {
        this._defineVariables();
    }

    show() {
        this.appIcon = new this.Tray(__dirname + '/../../res/icon.png');

        this.appIcon.setToolTip('Flashlight.');
        this.appIcon.setContextMenu(this.contextMenu);
    }

    destroy() {
        this.appIcon.destroy();
    }

    _dispatchOpenSearchWindowEvent() {
        this.EventEmitter.emit('open-search-window');
    }

    _dispatchCloseProgramEvent() {
        this.EventEmitter.emit('close-program');
    }

    _defineVariables() {
        // Main electron module, containing all default submodules
        this.electron = require('electron');

        this.Tray = this.electron.Tray;
        this.Menu = this.electron.Menu;

        this.Events = require('events');
        this.EventEmitter = new this.Events.EventEmitter();


        this.appIcon = null;

        this.contextMenu = this.Menu.buildFromTemplate([{
            label: 'Open New Search Window',
            click: () => {
                this._dispatchOpenSearchWindowEvent();
            }
        }, {
            label: 'Exit',
            click: () => {
                this._dispatchCloseProgramEvent();
            }
        }]);

        this._dispatchOpenSearchWindowEvent = this._dispatchOpenSearchWindowEvent.bind(this);
        this._dispatchCloseProgramEvent = this._dispatchCloseProgramEvent.bind(this);
    }
}

module.exports = new AppIcon;
