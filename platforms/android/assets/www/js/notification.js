$(document).ready(function() {
    cordova.plugins.notification.local.hasPermission(function (granted) {
         console.log('Permission has been granted: ' + granted);
    });
});