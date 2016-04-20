'use strict';

// Main electron module, containing all default submodules
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
//Module to listen for global key shortcuts
const globalShortcut = electron.globalShortcut;
// Module to communicate with the browser window
const ipc = electron.ipcMain;

// Create context menus
const Menu = electron.Menu;

// Create tray icons
const Tray = electron.Tray;

// Module that contains search logic
const Search = require('./modules/search');

// Module that launces programs
const Launcher = require('./modules/launcher');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let appIcon = null;

//@TODO: let the user decide this
let skin = "default";

let matches = [];

let shouldQuit = false;

//This function creates a new search window
function createSearchWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        transparent: true,
        frame: false
    });

    // and load the index.html of the app.
    mainWindow.loadURL('file://' + __dirname + '/skins/' + skin + '/skin.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    //Only create a new search window if there isnt one already
    if (!mainWindow) {
        // Register a shortcut listener.
        // @TODO: Make this shortcut adjustable
        let ret = globalShortcut.register('CommandOrControl+Q', function() {
            if (!mainWindow) {
                createSearchWindow();
            }
        });

        if (!ret) {
            throw new Error('Could not register global keyboard shortcut');
        }
    }

    if (!appIcon) {
        appIcon = new Tray('./res/icon.png');
        var contextMenu = Menu.buildFromTemplate([{
            label: 'Open New Search Window',
            click: function() {
                createSearchWindow();
            }
        }, {
            label: 'Exit',
            click: function() {
                shouldQuit = true;
                app.quit();
            }
        }]);
        appIcon.setToolTip('Flashlight.');
        appIcon.setContextMenu(contextMenu);
    }

    //Print informational message to console
    console.log("Flashlight is now ready. Start a search with Ctrl/Cmd + Q, or right click on the tray icon");
});

// Cleanup after quit
app.on('quit', function() {
    appIcon = null;
    mainWindow = null;
});

app.on('activate', function() {
    if (mainWindow === null) {
        createSearchWindow();
    }
});

app.on('before-quit', function(e) {
    if(!shouldQuit) {
        e.preventDefault();
    }
});

//@TODO: Find a way to send key event instead of keycode
// Electron only sends an empty array if an event is passed
ipc.on('search-key-up', function(e, input) {
    Search.search(input, function(value) {
        matches = value;
        e.sender.send('updated-programs', matches);
    });
});

ipc.on('search-pressed-enter', function(e, input) {
    if (matches) {
        //console.log(matches[0].value.name);
        //@TODO: Validation of program
        Launcher.launch(matches[0].value.path);
        e.sender.send('action-executed');
    }
})
