class App {
    constructor() {
        this._defineVariables();
    }

    boot() {
        this._ensureSingleInstance().then(() => {
            this.createTrayIcon();

            this._registerEventHandlers();

            this.KeyboardHandler.register(this.shortcut);

            //Print informational message to console
            console.log("Flashlight is now ready. Start a search with " + this.shortcut + ", or right click on the tray icon");
        }).catch((e) => {
            console.log("Another instance of flashlight is already running.");
            // Someone tried to run a second instance, we should focus our window.
            if (this.SearchWindow.isOpen()) {
                console.log("Handle window");
                if (this.SearchWindow.mainWindow.isMinimized()) this.SearchWindow.restore();
                this.SearchWindow.focus();
            }

            this.app.quit();
        });
    }

    openSearchWindow() {
        this.SearchWindow.show(this.skin);
    }

    createTrayIcon() {
        this.AppIcon.show();
    }

    _ensureSingleInstance() {
        return new Promise((resolve, reject) => {
            let shouldQuit = this.app.makeSingleInstance(function(commandLine, workingDirectory) {});

            if (shouldQuit) {
                return reject();
            } else {
                return resolve();
            }
        });
    }

    _registerEventHandlers() {
        this.openSearchWindow = this.openSearchWindow.bind(this);
        this.onAppBeforeQuit = this.onAppBeforeQuit.bind(this);
        this.onAppWillQuit = this.onAppWillQuit.bind(this);
        this.onAppQuit = this.onAppQuit.bind(this);
        this.onAppActivate = this.onAppActivate.bind(this);
        this.onAppIconOpenSeachWindow = this.onAppIconOpenSeachWindow.bind(this);
        this.onKeyboardHandlerShortcutPressed = this.onKeyboardHandlerShortcutPressed.bind(this);
        this.onAppIconCloseProgram = this.onAppIconCloseProgram.bind(this);

        this.app.on('window-all-closed', this.app.quit);
        this.app.on('before-quit', this.onAppBeforeQuit);
        this.app.on('will-quit', this.onAppWillQuit);
        this.app.on('quit', this.onAppQuit);
        this.app.on('activate', this.onAppActivate);

        this.AppIcon.EventEmitter.on('open-search-window', this.onAppIconOpenSeachWindow);
        this.AppIcon.EventEmitter.on('close-program', this.onAppIconCloseProgram);

        this.KeyboardHandler.EventEmitter.on('shotcut-pressed', this.onKeyboardHandlerShortcutPressed);

    }

    onAppBeforeQuit(e) {
        if (!this.shouldQuit) {
            e.preventDefault();
        }
    }

    onAppWillQuit() {
        this.KeyboardHandler.unregister();

        if (this.SearchWindow.isOpen()) {
            this.SearchWindow.close();
        }
    }

    onAppQuit() {
        console.log("On App quit");
        this.AppIcon.destroy();
        this.AppIcon = null;
    }

    onAppActivate() {
        console.log("On App activate");
        if (!this.SearchWindow.isOpen) {
            this.openSearchWindow();
        }
    }

    onAppIconOpenSeachWindow() {
        this.openSearchWindow();
    }

    onAppIconCloseProgram() {
        this.shouldQuit = true;
        this.app.quit();
    }

    onKeyboardHandlerShortcutPressed() {
        this.openSearchWindow();
    }

    _defineVariables() {
        // Main electron module, containing all default submodules
        this.electron = require('electron');
        // Module to control application life.
        this.app = this.electron.app;

        this.KeyboardHandler = require('./KeyboardHandler');
        this.SearchWindow = require('./SearchWindow');
        this.AppIcon = require('./AppIcon');

        this.shouldQuit = false;

        //@TODO: Make config class
        this.shortcut = 'CommandOrControl+Q';
        this.skin = 'default';
    }
}

module.exports = new App;
