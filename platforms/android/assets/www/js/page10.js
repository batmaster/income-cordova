$(document).ready(function() {

    var group_id = 0;

    function getGroups() {
        $("#pageten #title-list .ui-controlgroup-controls").empty();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_groups",
            }
        }).done(function(response) {
            if (response != undefined) {
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    $("#pageten #title-list .ui-controlgroup-controls").append('<div class="ui-checkbox ui-screen-hidden"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off" data-id="' + r.id + '">' + r.title + ' @' + r.code + '</label><input type="checkbox"></div>');
                }
            }
        });
    }

    function getGroupDetail() {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_group",
                "group_id": localStorage.getItem(KEY_GROUPID)
            }
        }).done(function(response) {
            if (response != undefined) {
                $("#pageten #title").text(response.title);
                $("#pageten #code").text(response.code);
            }
            else {
                console.log("getting transaction failed");
            }
        });
    }

    function getUserDetail() {
    console.log("getUserDetail");
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_user",
                "user_id": localStorage.getItem(KEY_USERID)
            }
        }).done(function(response) {
        console.log(response)
            if (response != undefined) {
                $("#pageten #name").val(response.name);
                $("#pageten #lastname").val(response.lastname);
                $("#pageten #username").val(response.username);
                $("#pageten #email").val(response.email);
                $("#pageten #phone").val(response.phone);
                $("#pageten #birthday").val(response.birthday);
            }
            else {
                console.log("getting user failed");
            }
        });
    }

    $("#pageten #title-list").on('click', "label", function() {
        $("#pageten #title").val($(this).text().trim());
        group_id =  (-1 * $(this).data("id"));

        $(this).first().prop('checked', false);

        $("#pageten #title-list .ui-checkbox").each(function() {
            $(this).addClass("ui-screen-hidden");
        });
    });

    $(document).on('click','#pageten #join', function() {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "join_group",
                "user_id": localStorage.getItem(KEY_USERID),
                "group_id": group_id
            }
        }).done(function(response) {
            if (response != undefined) {
                console.log(response);
                if (response.ok) {
                    localStorage.setItem(KEY_GROUPID, group_id);
                    printLocalStorages();
                }
            }
        });
    });

    $(document).on("pagebeforeshow", "#pageten", function() {
        $("#pageten #not-join").hide(0);
        $("#pageten #joined").hide(0);
        $("#pageten #rejoin-group").hide(0);
        $("#pageten #rejoin").hide(0);
    });

    $(document).on("pageshow", "#pageten", function() {
        $("#pageten #title-list .ui-controlgroup-controls").removeClass("ui-screen-hidden");
        getGroups();
        getUserDetail();

        var g = Number(localStorage.getItem(KEY_GROUPID));
        if (g == 0) {
            $("#pageten #not-join").show(0);
        }
        else if (g > 0) {
            $("#pageten #joined").show(0);
            getGroupDetail();
        }
        else {
            $("#pageten #not-join").show(0);
            $("#pageten #join").val("เข้าร่วมกลุ่มอื่น");
            $("#pageten #join").button("refresh");
            $("#pageten #rejoin-group").show(0);
            $("#pageten #rejoin").show(0);

            $("#pageten #title").prop("disabled", true);
            $("#pageten #join").button("disable");

            $.ajax({
                url: SERVER_URL,
                type: "POST",
                dataType: "json",
                data: {
                    "function": "get_group",
                    "group_id": -1 * localStorage.getItem(KEY_GROUPID)
                }
            }).done(function(response) {
                if (response != undefined) {
                    $("#pageten #not-join #title").val(response.title + ' @' + response.code);
                    group_id = -1 * response.id;
                }
                else {
                    console.log("getting transaction failed");
                }
            });

            $(document).on("change", "#pageten #rejoin", function() {
                if ($(this).prop("checked")) {
                    $("#pageten #title").prop("disabled", false);
                    $("#pageten #join").button("enable");
                }
                else {
                    $("#pageten #title").prop("disabled", true);
                    $("#pageten #join").button("disable");
                }
            });
        }
    });

    $(document).on('change','#pageten #username', function() {
        checkUsernameExists();
    });

    $(document).on('change','#pageten input:not(#username)', function() {
        validateForm();
    });

    function checkUsernameExists() {
        $("#pageten #edit").button('disable');

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "check_user",
                "username": $("#pageten #username").val()
            }
        }).done(function(response) {
             console.log(JSON.stringify(response));
             if (Number(response.count) == 0) {
                $("#pageten #warning1").hide("slow");
                $("#pageten #edit").button('enable');
             }
             else {
                $("#pageten #warning1").show("fast");
                $("#pageten #edit").button('disable');
             }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });

    }

    function validateForm() {
        var correct = true;

        // check passwords matched
        if ($("#pageten #change-password").prop("checked")) {
            if ($("#pageten #password_new").val() != $("#pageten #password_new2").val()) {
                correct = false;
                $("#pageten #warning2").show("fast");
            }
            else {
                correct = true;
                $("#pageten #warning2").hide("slow");
            }
        }

        if (correct) {
            $("#pageten #edit").button('enable');
        }
        else {
            $("#pageten #edit").button('disable');
        }
    }

    $(document).on('change','#pageten #change-password', function() {
        if ($(this).prop("checked")) {
            $("#pageten #change-password-group").show("slow");
        }
        else {
            $("#pageten #change-password-group").hide("fast");
        }
    });

    $(document).on('click','#pageten #edit', function() {
        var password_new = MD5($("#pageten #password_new").val());
        if (!$("#pageten #change-password").prop("checked")) {
            password_new = "";
        }

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "edit_user",
                "user_id": localStorage.getItem(KEY_USERID),
                "name": $("#pageten #name").val(),
                "lastname": $("#pageten #lastname").val(),
                "username": $("#pageten #username").val(),
                "password": MD5($("#pageten #password").val()),
                "email": $("#pageten #email").val(),
                "level": $("#pageten #level").val(),
                "group": $("#pageten #group").val(),
                "phone": $("#pageten #phone").val(),
                "birthday": $("#pageten #birthday").val(),
                "password_new": password_new
            }
        }).done(function(response) {
            if (response != undefined) {
                console.log(response);
                if (response.ok) {

                }
                else {
                    console.log("wrong password")
                }
            }
        });
    });



    $("#pageten #group-input").hide(0);
    $("#pageten #warning1").hide(0);
    $("#pageten #warning2").hide(0);
    $("#pageten #change-password-group").hide(0);
});