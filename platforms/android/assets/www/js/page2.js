$(document).ready(function(){

    $(document).on('click','#pagetwo #logout', function() {
        localStorage.removeItem(KEY_USERID);
        $.mobile.changePage($("#pageone"), {transition: "slidedown", changeHash: false});
    });
});