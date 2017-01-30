$(document).ready(function() {

    $(document).on('click','#pageone #login', function() {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "login",
                "username": $("#pageone #username").val(),
                "password": MD5($("#pageone #password").val())
            }
        }).done(function(response) {
            if (response.id != undefined) {
                localStorage.setItem(KEY_USERID, response.id);
                printLocalStorages();

                $.mobile.changePage($("#pagetwo"), {transition: "slideup", changeHash: false});
            }
            else {
                $.mobile.changePage("#loginFailDialog", {role: "dialog", transition: "pop"});
            }
        });
    });
});