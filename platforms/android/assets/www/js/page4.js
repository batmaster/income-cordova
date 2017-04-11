$(document).ready(function() {

    $(document).on('click','#pagefour #date', function() {
        $("#pagefour #date").datebox('setTheDate', new Date());
    });

    $(document).on('click','#pagefour #time', function() {
        $("#pagefour #time").datebox('setTheDate', new Date());
    });

    $(document).on("pagebeforeshow", "#pagefour", function() {
        clearFields();
    });

    $(document).on('change','#pagefour #type', function() {
        getTransactionTitles();

        loadAutoList($("#pagefour #type").val());
    });

    function loadAutoList(l) {
        $('#pagefour #title0').empty();

        var fn = l == 0 ? "get_list_income" : "get_list_outcome";

        loading();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": fn,
            }
        }).done(function(response) {

            if (response != undefined) {
                hideLoading();

                for(var i = 0; i < response.length; i++) {
                    $('#pagefour #title0').append('<option value="' + response[i].title + '">' + response[i].title + '</option>');
                }
                $('#pagefour #title0').append('<option value="อื่นๆ">อื่นๆ</option>');
                $('#pagefour #title0').selectmenu();
                $('#pagefour #title0').selectmenu("refresh");

                $("#pagefour #title-group").hide();

            }
            else {
                console.log("getting transaction failed");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });
    }

    $(document).on('change','#pagefour #title0', function() {
        if ($("#pagefour #title0").val() == "อื่นๆ") {
            $("#pagefour #title").val("");
            $("#pagefour #title-group").show("fast");
        }
        else {
            $("#pagefour #title-group").hide("fast");
        }
    });

    $(document).on('click','#pagefour #submit', function() {
        var d = $("#pagefour #date").datebox('getTheDate');
        var t = $("#pagefour #time").datebox('getTheDate');
        var date = TODATE(d.getFullYear(), d.getMonth() + 1, d.getDate(), t.getHours(), t.getMinutes(), 0);

        var title = $("#pagefour #title0").val();
        if (title == "อื่นๆ") {
            title = $("#pagefour #title").val();
        }

        loading();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "add_transaction",
                "user_id": localStorage.getItem(KEY_USERID),
                "type": $("#pagefour #type").val(),
                "title": title,
                "amount": $("#pagefour #amount").val(),
                "date": date,
                "group_id": localStorage.getItem(KEY_GROUPID)
            }
        }).done(function(response) {
            hideLoading();
            if (response.id != undefined) {
                toast("เพิ่มรายการเรียบร้อยแล้ว");
                clearFields();
            }
            else {
                console.log("adding transaction failed");
            }
        });
    });

    function getTransactionTitles() {
        $("#pagefour #title-list .ui-controlgroup-controls").empty();
        loading();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_transaction_titles",
                "user_id": localStorage.getItem(KEY_USERID),
                "type": $("#pagefour #type").val()
            }
        }).done(function(response) {
            if (response != undefined) {
                hideLoading();
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    $("#pagefour #title-list .ui-controlgroup-controls").append('<div class="ui-checkbox ui-screen-hidden"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off">' + r.title + '</label><input type="checkbox"></div>');
                }
            }
        });
    }

    function clearFields() {
        $("#pagefour #date").datebox('setTheDate', new Date());
        $("#pagefour #time").datebox('setTheDate', new Date());

        $("#pagefour #title").val("");
        $("#pagefour #amount").val("");
    }

    $("#pagefour #title-list").on('click', "label", function() {
        console.log($(this).text().trim());
        $("#pagefour #title").val($(this).text().trim());
        $(this).first().prop('checked', false);

        $("#pagefour #title-list .ui-checkbox").each(function() {
            $(this).addClass("ui-screen-hidden");
        });
    });


    $(document).on("pageshow", "#pagefour", function() {

        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
            $.mobile.changePage($("#pagetwo"), {transition: "slidedown", changeHash: false});
        }, false);

        loadAutoList(0);

        $("#pagefour #title-list .ui-controlgroup-controls").removeClass("ui-screen-hidden");
        getTransactionTitles();

        if (localStorage.getItem(KEY_NOTI_SCHEDULE_ID_CLICKED) != undefined) {
            var id = localStorage.getItem(KEY_NOTI_SCHEDULE_ID_CLICKED);
            loading();
            $.ajax({
                url: SERVER_URL,
                type: "POST",
                dataType: "json",
                data: {
                    "function": "get_schedule",
                    "id": id
                }
            }).done(function(response) {
                if (response != undefined) {
                    hideLoading();
                    $("#pagefour #type").val(response.type).selectmenu("refresh");
                    $("#pagefour #title").val(response.title);
                    $("#pagefour #amount").focus();

                    localStorage.removeItem(KEY_NOTI_SCHEDULE_ID_CLICKED);
                }
            });
        }

    });
});
