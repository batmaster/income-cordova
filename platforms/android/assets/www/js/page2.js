$(document).ready(function(){

    $(document).on('click','#pagetwo #logout', function() {
        localStorage.removeItem(KEY_USERID);
        localStorage.removeItem(KEY_LEVEL);
        localStorage.removeItem(KEY_GROUPID);
        $.mobile.changePage($("#pageone"), {transition: "slidedown", changeHash: false});
    });
});