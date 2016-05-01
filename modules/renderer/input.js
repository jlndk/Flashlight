const electron = require('electron');
const ipc = electron.ipcRenderer;

class Input {

    constructor() {
        this.input = null;

        //Keeping last input to prevent spamming ipc
        this.lastInput = "";

        this.onExecuted = function() {};
        this.onProgramsChanged = function(matches) {};

        ipc.on('action-executed', () => {
            this.onExecuted();
        });

        ipc.on('updated-programs', (e, matches) => {
            this.onProgramsChanged(matches);
        });
    }

    attatch(input) {
        //@TODO: validate input (check if it is actually an input)

        this.input = input;

        this.input.addEventListener('keyup', (evn) => {

            if (this.input.value == "" && this.lastInput == "") {
                return false;
            }

            switch(evn.code) {
                case "Enter":
                    ipc.send("search-pressed-enter", this.input.value);
                    break;
            }

            //Always send key up event
            ipc.send('search-key-up', this.input.value);

            this.lastInput = this.input.value;
        });
    }
}

module.exports = new Input();
