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

    function getGroupDetail(group_id) {
            $.ajax({
                url: SERVER_URL,
                type: "POST",
                dataType: "json",
                data: {
                    "function": "get_group",
                    "group_id": group_id
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

        var g = Number(localStorage.getItem(KEY_GROUPID));
        if (g == 0) {
            $("#pageten #not-join").show(0);
        }
        else if (g > 0) {
            $("#pageten #joined").show(0);
            getGroupDetail(localStorage.getItem(KEY_GROUPID));
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
});