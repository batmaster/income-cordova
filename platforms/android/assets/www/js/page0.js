$(document).ready(function() {


    $(document).on("pageshow", "#pagezero", function() {
        hideLoading();

        if (localStorage.getItem(KEY_NOTI_SCHEDULE_ID_CLICKED) != undefined) {
            document.location.hash = "#pagefour";
        }
    });

    $(document).on( "mobileinit", function() {
        $.mobile.selectmenu.prototype.options.nativeMenu = false;
    });
});
