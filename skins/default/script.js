(function() {
    'use strict';

    const Input = require('../../modules/renderer/input');
    const remote = require('remote');

    const window = remote.getCurrentWindow();

    let main = document.querySelector("#main");
    let placeholder = document.querySelector("#back");
    let query = document.querySelector("#query");

    Input.attatch(query);

    setTimeout(revealSearch, 40);

    function revealSearch() {
        main.classList.add("visible");
        query.focus();
    }

    function killSearch() {
        main.classList.remove("visible");
        setTimeout(function() {
            window.close();
        }, 550);
    }

    query.addEventListener('keyup', (e) => {
        switch (e.code) {
            case "Escape":
                killSearch();
                break;
        }
    });

    Input.onExecuted = function() {
        killSearch();
    }

    Input.onProgramsChanged = function(matches) {
        if(matches) {
            let best = matches[0].value.name;

            placeholder.innerHTML = best;
        }else {
            if(query.value.trim() == "") {
                placeholder.innerHTML = "Search";
            }else {
                placeholder.innerHTML = "";
            }
        }
    }

})();
