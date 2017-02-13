$(document).ready(function() {
    $(document).on('click','#pagefour #date', function() {
        $("#pagefour #date").datebox('setTheDate', new Date());
    });

    $(document).on('click','#pagefour #time', function() {
        var d = new Date();
        $("#pagefour #time").datebox('setTheDate', new Date());
    });

    $(document).on("pagebeforeshow", "#pagefour", function() {
        $("#pagefour #date").datebox('setTheDate', new Date());
        $("#pagefour #time").datebox('setTheDate', new Date());

        $("#pagefour #type").val(0);
        $("#pagefour #title").val("");
        $("#pagefour #amount").val("");
    });

    $(document).on('change','#pagefour #type', function() {
        getTransactionTitles();
    });

    $(document).on('click','#pagefour #submit', function() {
        var d = $("#pagefour #date").datebox('getTheDate');
        var t = $("#pagefour #time").datebox('getTheDate');
        var date = TODATE(d.getFullYear(), d.getMonth() + 1, d.getDate(), t.getHours(), t.getMinutes(), 0);

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "add_transaction",
                "user_id": localStorage.getItem(KEY_USERID),
                "type": $("#pagefour #type").val(),
                "title": $("#pagefour #title").val(),
                "amount": $("#pagefour #amount").val(),
                "date": date,
                "group_id": localStorage.getItem(KEY_GROUPID)
            }
        }).done(function(response) {
            if (response.id != undefined) {
                console.log("adding transaction ok");
            }
            else {
                console.log("adding transaction failed");
            }
        });
    });

    function getTransactionTitles() {
        $("#pagefour #title-list .ui-controlgroup-controls").empty();
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
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    $("#pagefour #title-list .ui-controlgroup-controls").append('<div class="ui-checkbox ui-screen-hidden"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off">' + r.title + '</label><input type="checkbox"></div>');
                }
            }
        });
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
        $("#pagefour #title-list .ui-controlgroup-controls").removeClass("ui-screen-hidden");
        getTransactionTitles();
    });


});
