class SearchWindow {
    constructor() {
        this._defineVariables();
    }

    show(skin) {
        this.screen = this.electron.screen;

        if(this.screen.getAllDisplays().length > 1) {
            let bounds = this.screen.getPrimaryDisplay().bounds;

            let y = (bounds.height  - (bounds.height / 100 * 75));

            Object.assign(this.opts, {
                x: bounds.width,
                y: y
            });
        }

        // Create the browser window.
        this.mainWindow = new this.BrowserWindow(this.opts);

        // and load the index.html of the app.
        this.mainWindow.loadURL('file://' + __dirname + '/../../skins/' + skin + '/skin.html');
        
        // Open the DevTools.
        //this.mainWindow.webContents.openDevTools();

        // Emitted when the window is closed.
        this.mainWindow.on('closed', this.close);

        //Emitted when the window is opened
        this.mainWindow.on('opened', this.onOpen);
    }

    restore() {
        if(this.mainWindow) this.mainWindow.restore();
    }

    close() {
        if(this.mainWindow) this.mainWindow.removeAllListeners('close');
        this.mainWindow.close();
        this.mainWindow = null;
    }

    onOpen() {
        this.mainWindow.focus();
    }

    focus() {
        if(this.mainWindow) this.mainWindow.show();
    }

    isOpen() {
        return (this.mainWindow !== null);
    }

    _defineVariables() {
        // Main electron module, containing all default submodules
        this.electron = require('electron');
        // Module to create native browser window.
        this.BrowserWindow = this.electron.BrowserWindow;

        this.screen = null;

        this.mainWindow = null;

        this.opts = {
            transparent: true,
            frame: false,
            //center: true
        };
    }
}

module.exports = new SearchWindow;
