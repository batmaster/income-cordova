$(document).ready(function() {

    $(document).on('click','#pagesix #days #time', function() {
        $("#pagesix #days #time").datebox('setTheDate', new Date());
    });

    $(document).on('click','#pagesix #month #time', function() {
        $("#pagesix #month #time").datebox('setTheDate', new Date());
    });

    $(document).on('change','#pagesix #type', function() {
        getTransactionTitlesPageSix();
    });

    $("#pagesix #title-list").on('click', "label", function() {
        console.log($(this).text().trim());
        $("#pagesix #title").val($(this).text().trim());
        $(this).first().prop('checked', false);

        $("#pagesix #title-list .ui-checkbox").each(function() {
            $(this).addClass("ui-screen-hidden");
        });
    });

    $(document).on('click', "#pagesix #days #submit", function() {
    var t = $("#pagesix #days #time").datebox('getTheDate');

        var frequency = "0 ";
        frequency += $("#pagesix #days #checkbox-su").is(':checked') ? "1" : "0";
        frequency += $("#pagesix #days #checkbox-mo").is(':checked') ? "1" : "0";
        frequency += $("#pagesix #days #checkbox-tu").is(':checked') ? "1" : "0";
        frequency += $("#pagesix #days #checkbox-we").is(':checked') ? "1" : "0";
        frequency += $("#pagesix #days #checkbox-th").is(':checked') ? "1" : "0";
        frequency += $("#pagesix #days #checkbox-fr").is(':checked') ? "1" : "0";
        frequency += $("#pagesix #days #checkbox-sa").is(':checked') ? "1" : "0";

        frequency += " " + t.getHours() + ":" + t.getMinutes();

        addSchedule(frequency);
    });

    $(document).on('click', "#pagesix #month #submit", function() {
        var t = $("#pagesix #month #time").datebox('getTheDate');

        var frequency = "1 " + $("#pagesix #month #date").val() + " " + t.getHours() + ":" + t.getMinutes();
        addSchedule(frequency);
    });


    function addSchedule(frequency) {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "add_schedule",
                "user_id": localStorage.getItem(KEY_USERID),
                "type": $("#pagesix #type").val(),
                "title": $("#pagesix #title").val(),
                "frequency": frequency
            }
        }).done(function(response) {
            if (response != undefined) {
                clearFields();
                refreshScheduleTable();
                syncSchedules();
            }
        });
    }

    function clearFields() {
            $("#pagesix #days #checkbox-su").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #checkbox-mo").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #checkbox-tu").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #checkbox-we").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #checkbox-th").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #checkbox-fr").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #checkbox-sa").prop('checked', false).checkboxradio("refresh");
            $("#pagesix #days #time").datebox('setTheDate', new Date());

            $("#pagesix #month #time").datebox('setTheDate', new Date());

            $("#pagesix #title").val("");
        }

    function getTransactionTitlesPageSix() {
        $("#pagesix #title-list .ui-controlgroup-controls").empty();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_transaction_titles",
                "user_id": localStorage.getItem(KEY_USERID),
                "type": $("#pagesix #type").val()
            }
        }).done(function(response) {
            if (response != undefined) {
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    $("#pagesix #title-list .ui-controlgroup-controls").append('<div class="ui-checkbox ui-screen-hidden"><label class="ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left ui-checkbox-off">' + r.title + '</label><input type="checkbox"></div>');
                }
            }
        });
    }

    $(document).on("pageshow", "#pagesix", function() {
        clearFields();

        $("#pagesix #title-list .ui-controlgroup-controls").removeClass("ui-screen-hidden");
        getTransactionTitlesPageSix();
    });
});


