$(document).ready(function() {
    $(document).on("pageshow", "#pagezero", function() {
        hideLoading();

        if (localStorage.getItem(KEY_LEVEL) == 0) {
            $("#menu2").show();
            $("#menu4").show();
            $("#menu5").show();
            $("#menu6").show();
            $("#menu7").hide();
            $("#menu8").hide();
            $("#menu9").show();
            $("#menu10").hide();
            console.log(00);
        }
        else if (localStorage.getItem(KEY_LEVEL) == 1) {
            $("#menu2").show();
            $("#menu4").show();
            $("#menu5").show();
            $("#menu6").show();
            $("#menu7").show();
            $("#menu8").show();
            $("#menu9").show();
            $("#menu10").hide();
            console.log(11);
        }
        else {
            $("#menu2").hide();
            $("#menu4").hide();
            $("#menu5").hide();
            $("#menu6").hide();
            $("#menu7").hide();
            $("#menu8").hide();
            $("#menu9").hide();
            $("#menu10").show();
            console.log(-1);
        }

        if (localStorage.getItem(KEY_NOTI_SCHEDULE_ID_CLICKED) != undefined) {
            document.location.hash = "#pagefour";
        }
    });

    $(document).on( "mobileinit", function() {
        $.mobile.selectmenu.prototype.options.nativeMenu = false;
    });
});
