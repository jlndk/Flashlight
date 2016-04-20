var AutoLaunch = require('auto-launch');

var appLauncher = new AutoLaunch({
	name: 'Flashlight'
});

appLauncher.isEnabled().then(function(enabled){
	if(enabled) return;
	return appLauncher.enable()
}).then(function(err){

});
