class CrashHandler {
    handle(e) {
        return new Promise(function(resolve, reject) {
            console.log("An error has occoured");
            console.log(e);
            resolve(e);
        });
    }
}

module.exports = new CrashHandler;
