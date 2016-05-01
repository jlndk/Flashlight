const ipc = require('electron').ipcMain;

const FuzzySearch = require('fuzzysearch-js');
const levenshteinFS = require('fuzzysearch-js/js/modules/LevenshteinFS');
const indexOfFS = require('fuzzysearch-js/js/modules/IndexOfFS');
const wordCountFS = require('fuzzysearch-js/js/modules/WordCountFS');

class Search {
    constructor() {
        // @TODO: Generate this dynamicly in another module
        this.list = [{
            name: 'Google Chrome',
            path: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        }, {
            name: 'Adobe Photoshop CC 2015',
            path: 'C:\\Program Files\\Adobe\\Adobe Photoshop CC 2015\\Photoshop.exe'
        }, {
            name: 'Postman',
            path: 'path/to/pman.exe'
        }];

        this.fuzzySearch = new FuzzySearch(this.list, {
            'minimumScore': 300,
            'termPath': 'name'
        });

        this.fuzzySearch.addModule(levenshteinFS({
            'maxDistanceTolerance': 3,
            'factor': 3
        }));
        this.fuzzySearch.addModule(indexOfFS({
            'minTermLength': 3,
            'maxIterations': 500,
            'factor': 3
        }));
        this.fuzzySearch.addModule(wordCountFS({
            'maxWordTolerance': 3,
            'factor': 1
        }));
    }

    search(query, callback) {
        //Make sure there's a function, so we dont try to call undefined
        callback = (!callback) ? function(value){} : callback;

        let matches = this.fuzzySearch.search(query);

        callback(matches);
    }

}

module.exports = new Search;
