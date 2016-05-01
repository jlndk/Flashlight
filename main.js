'use strict';

const App = require('./modules/main/App');
const CrashHandler = require('./modules/main/CrashHandler');

const electron = require('electron');

// Module to control application life.
const app = electron.app;

// Module to communicate with the browser window
const ipc = electron.ipcMain;


// Module that contains search logic
const Search = require('./modules/main/Search');

// Module that launces programs
const Launcher = require('./modules/main/launcher');


let matches = [];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    try {
        App.boot();
    } catch (e) {
        var handle = CrashHandler.handle(e);

        handle.then((e) => {
            console.log("then");
            app.quit();
        });

        return;
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
        //@TODO: Validation of program
        Launcher.launch(matches[0].value.path);
        e.sender.send('action-executed');
    }
})
