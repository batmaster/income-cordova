$(document).ready(function() {
//	$(document).on('pagebeforeshow','#pagetwo', function() {
//		var user_id = localStorage.getItem("local_user_id");
//		var user_pass = localStorage.getItem("local_user_pass");
//		$("#pagetwo .user_id").html(user_id);
//		$("#pagetwo .user_pass").html(user_pass);
//	});

    $(document).on('change','#pagethree #level', function() {
        if ($("#pagethree #level").val() == 0) {
            $("#pagethree #group-input").hide("slow");
            $("#pagethree #group").val("");
        }
        else {
            $("#pagethree #group-input").show("slow");
        }
    });

    $(document).on('click','#pagethree #register', function() {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "add_user",
                "name": $("#pagethree #name").val(),
                "lastname": $("#pagethree #lastname").val(),
                "username": $("#pagethree #username").val(),
                "password": MD5($("#pagethree #password").val()),
                "email": $("#pagethree #email").val(),
                "level": $("#pagethree #level").val(),
                "group": $("#pagethree #group").val(),
                "phone": $("#pagethree #phone").val(),
                "birthday": $("#pagethree #birthday").val(),
            }
        }).done(function(response) {
            console.log(response);
            localStorage.setItem(KEY_USERID, response.id);
            localStorage.setItem(KEY_LEVEL, $("#pagethree #level").val());
            localStorage.setItem(KEY_GROUPID, response.group_id);
            printLocalStorages();

            $.mobile.changePage($("#pagetwo"), {transition: "slideup", changeHash: false});
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });
    });

    $(document).on('change','#pagethree #username', function() {
        checkUsernameExists();
    });

    $(document).on('change','#pagethree input:not(#username)', function() {
        validateForm();
    });

    function checkUsernameExists() {
        $("#pagethree #register").button('disable');

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "check_user",
                "username": $("#pagethree #username").val()
            }
        }).done(function(response) {
             console.log(JSON.stringify(response));
             if (response.count == 0) {
                $("#pagethree #warning1").hide("slow");
                $("#pagethree #register").button('enable');
             }
             else {
                $("#pagethree #warning1").show("fast");
                $("#pagethree #register").button('disable');
             }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });

    }

    function validateForm() {
        var correct = true;

        // check passwords matched
        if ($("#pagethree #password").val() != $("#pagethree #password2").val()) {
            correct = false;
            $("#pagethree #warning2").show("fast");
        }
        else {
            correct = true;
            $("#pagethree #warning2").hide("slow");
        }


        if (correct) {
            $("#pagethree #register").button('enable');
        }
        else {
            $("#pagethree #register").button('disable');
        }

        console.log(correct);
    }

    $("#pagethree #group-input").hide(0);
    $("#pagethree #warning1").hide(0);
    $("#pagethree #warning2").hide(0);
});
