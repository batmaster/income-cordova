$(document).ready(function() {
    var group_id = 0;

    function getGroups() {
        $("#pagenine #title-list .ui-controlgroup-controls").empty();
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
                    $("#pagenine #title-list .ui-controlgroup-controls").append('<div class="ui-checkbox ui-screen-hidden"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off" data-id="' + r.id + '">' + r.title + ' @' + r.code + '</label><input type="checkbox"></div>');
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
                $("#pagenine #title").text(response.title);
                $("#pagenine #code").text(response.code);
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
                $("#pagenine #name").val(response.name);
                $("#pagenine #lastname").val(response.lastname);
                $("#pagenine #username").val(response.username);
                $("#pagenine #email").val(response.email);
                $("#pagenine #phone").val(response.phone);
                $("#pagenine #birthday").val(response.birthday);
            }
            else {
                console.log("getting user failed");
            }
        });
    }

    $("#pagenine #title-list").on('click', "label", function() {
        $("#pagenine #title").val($(this).text().trim());
        group_id =  (-1 * $(this).data("id"));

        $(this).first().prop('checked', false);

        $("#pagenine #title-list .ui-checkbox").each(function() {
            $(this).addClass("ui-screen-hidden");
        });
    });

    $(document).on('click','#pagenine #join', function() {
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

    $(document).on("pagebeforeshow", "#pagenine", function() {
        $("#pagenine #not-join").hide(0);
        $("#pagenine #joined").hide(0);
        $("#pagenine #rejoin-group").hide(0);
        $("#pagenine #rejoin").hide(0);
    });

    $(document).on("pageshow", "#pagenine", function() {
        $("#pagenine #title-list .ui-controlgroup-controls").removeClass("ui-screen-hidden");
        getGroups();
        getUserDetail();

        var g = Number(localStorage.getItem(KEY_GROUPID));
        if (g == 0) {
            $("#pagenine #not-join").show(0);
        }
        else if (g > 0) {
            $("#pagenine #joined").show(0);
            getGroupDetail();
        }
        else {
            $("#pagenine #not-join").show(0);
            $("#pagenine #join").val("เข้าร่วมกลุ่มอื่น");
            $("#pagenine #join").button("refresh");
            $("#pagenine #rejoin-group").show(0);
            $("#pagenine #rejoin").show(0);

            $("#pagenine #title").prop("disabled", true);
            $("#pagenine #join").button("disable");

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
                    $("#pagenine #not-join #title").val(response.title + ' @' + response.code);
                    group_id = -1 * response.id;
                }
                else {
                    console.log("getting transaction failed");
                }
            });

            $(document).on("change", "#pagenine #rejoin", function() {
                if ($(this).prop("checked")) {
                    $("#pagenine #title").prop("disabled", false);
                    $("#pagenine #join").button("enable");
                }
                else {
                    $("#pagenine #title").prop("disabled", true);
                    $("#pagenine #join").button("disable");
                }
            });
        }
    });

    $(document).on('change','#pagenine #username', function() {
        checkUsernameExists();
    });

    $(document).on('change','#pagenine input:not(#username)', function() {
        validateForm();
    });

    function checkUsernameExists() {
        $("#pagenine #edit").button('disable');

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "check_user",
                "username": $("#pagenine #username").val()
            }
        }).done(function(response) {
             console.log(JSON.stringify(response));
             if (Number(response.count) == 0) {
                $("#pagenine #warning1").hide("slow");
                $("#pagenine #edit").button('enable');
             }
             else {
                $("#pagenine #warning1").show("fast");
                $("#pagenine #edit").button('disable');
             }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });

    }

    function validateForm() {
        var correct = true;

        // check passwords matched
        if ($("#pagenine #change-password").prop("checked")) {
            if ($("#pagenine #password_new").val() != $("#pagenine #password_new2").val()) {
                correct = false;
                $("#pagenine #warning2").show("fast");
            }
            else {
                correct = true;
                $("#pagenine #warning2").hide("slow");
            }
        }

        if (correct) {
            $("#pagenine #edit").button('enable');
        }
        else {
            $("#pagenine #edit").button('disable');
        }
    }

    $(document).on('change','#pagenine #change-password', function() {
        if ($(this).prop("checked")) {
            $("#pagenine #change-password-group").show("slow");
        }
        else {
            $("#pagenine #change-password-group").hide("fast");
        }
    });

    $(document).on('click','#pagenine #edit', function() {
        var password_new = MD5($("#pagenine #password_new").val());
        if (!$("#pagenine #change-password").prop("checked")) {
            password_new = "";
        }

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "edit_user",
                "user_id": localStorage.getItem(KEY_USERID),
                "name": $("#pagenine #name").val(),
                "lastname": $("#pagenine #lastname").val(),
                "username": $("#pagenine #username").val(),
                "password": MD5($("#pagenine #password").val()),
                "email": $("#pagenine #email").val(),
                "level": $("#pagenine #level").val(),
                "group": $("#pagenine #group").val(),
                "phone": $("#pagenine #phone").val(),
                "birthday": $("#pagenine #birthday").val(),
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



    $("#pagenine #group-input").hide(0);
    $("#pagenine #warning1").hide(0);
    $("#pagenine #warning2").hide(0);
    $("#pagenine #change-password-group").hide(0);
});