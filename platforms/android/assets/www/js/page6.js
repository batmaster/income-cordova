$(document).ready(function() {

    $(document).on('click','#scheduleEditDialog #days #time', function() {
        $("#scheduleEditDialog #days #time").datebox('setTheDate', new Date());
    });

    $(document).on('click','#scheduleEditDialog #month #time', function() {
        $("#scheduleEditDialog #month #time").datebox('setTheDate', new Date());
    });

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

        if (frequency == "0 0000000") {
            frequency = "0 1111111";
        }

        frequency += " " + TOTIME(t.getHours(), t.getMinutes());

        addSchedule(frequency);
    });

    $(document).on('click', "#pagesix #month #submit", function() {
        var t = $("#pagesix #month #time").datebox('getTheDate');

        var frequency = "1 " + $("#pagesix #month #date").val() + " " + TOTIME(t.getHours(), t.getMinutes());
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
                getSchedulesTable();
                syncSchedules();

                $("#pagesix #tab1").trigger('click');
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

        getSchedulesTable();
    });
});

function showScheduleEditField(id, type, title, frequency) {
    $("#scheduleEditDialog").data("id", id);

    $("#scheduleEditDialog #type").selectmenu().val(type).selectmenu("refresh");
    $("#scheduleEditDialog #title").val(title);

    frequency = frequency.split(" ");
    if (frequency[0] == "0") {
        $("#scheduleEditDialog #days").collapsible().collapsible("expand");
        $("#scheduleEditDialog #month").collapsible().collapsible("collapse");

        $("#scheduleEditDialog #days #checkbox-su").checkboxradio().prop('checked', frequency[1][0] == "1" ? true : false).checkboxradio("refresh");
        $("#scheduleEditDialog #days #checkbox-mo").checkboxradio().prop('checked', frequency[1][1] == "1" ? true : false).checkboxradio("refresh");
        $("#scheduleEditDialog #days #checkbox-tu").checkboxradio().prop('checked', frequency[1][2] == "1" ? true : false).checkboxradio("refresh");
        $("#scheduleEditDialog #days #checkbox-we").checkboxradio().prop('checked', frequency[1][3] == "1" ? true : false).checkboxradio("refresh");
        $("#scheduleEditDialog #days #checkbox-th").checkboxradio().prop('checked', frequency[1][4] == "1" ? true : false).checkboxradio("refresh");
        $("#scheduleEditDialog #days #checkbox-fr").checkboxradio().prop('checked', frequency[1][5] == "1" ? true : false).checkboxradio("refresh");
        $("#scheduleEditDialog #days #checkbox-sa").checkboxradio().prop('checked', frequency[1][6] == "1" ? true : false).checkboxradio("refresh");
    }
    else {
        $("#scheduleEditDialog #days").collapsible().collapsible("collapse");
        $("#scheduleEditDialog #month").collapsible().collapsible("expand");

        $("#scheduleEditDialog #date").selectmenu().val(frequency[1]).selectmenu("refresh");
    }

    $("#scheduleEditDialog #days #time").val(frequency[2]);
    $("#scheduleEditDialog #month #time").val(frequency[2]);

    $.mobile.changePage("#scheduleEditDialog", {role: "dialog", transition: "pop"});
}

function saveScheduleEdit(tab) {
console.log(tab);

    var id = $("#scheduleEditDialog").data("id");
    var title = $("#scheduleEditDialog #title").val();
    var type = $("#scheduleEditDialog #type").val();

    var time;
    var frequency;

    if (tab == 0) {
    time = $("#scheduleEditDialog #days #time").datebox('getTheDate');

    frequency = "0 ";
    frequency += $("#scheduleEditDialog #days #checkbox-su").is(':checked') ? "1" : "0";
    frequency += $("#scheduleEditDialog #days #checkbox-mo").is(':checked') ? "1" : "0";
    frequency += $("#scheduleEditDialog #days #checkbox-tu").is(':checked') ? "1" : "0";
    frequency += $("#scheduleEditDialog #days #checkbox-we").is(':checked') ? "1" : "0";
    frequency += $("#scheduleEditDialog #days #checkbox-th").is(':checked') ? "1" : "0";
    frequency += $("#scheduleEditDialog #days #checkbox-fr").is(':checked') ? "1" : "0";
    frequency += $("#scheduleEditDialog #days #checkbox-sa").is(':checked') ? "1" : "0";

    if (frequency == "0 0000000") {
        frequency = "0 1111111";
    }

    }
    else {
        time = $("#scheduleEditDialog #month #time").datebox('getTheDate');

        frequency = "1 " + $("#scheduleEditDialog #date").val()
    }

    frequency += " " + TOTIME(time.getHours(), time.getMinutes());

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "edit_schedule",
            "id": id,
            "title": title,
            "type": type,
            "frequency": frequency
        }
    }).done(function(response) {
        console.log(response);
        $("#scheduleEditDialog").dialog("close");
        getSchedulesTable();
        syncSchedules();
    });
}

function getSchedulesTable() {
    $("#pagesix #table-body").empty();

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_schedules",
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {
        $("#pagesix #table-body").empty();
        if (response != undefined) {
            for (var i = 0; i < response.length; i++) {
                var r = response[i];

                var frequency = r["frequency"].split(" ");
                var text = "";
                if (frequency[0] == "0") {
                    var schedules = [];

                    text += "ทุกวัน ";

                    var ds = frequency[1];
                    for (var j = 0; j < ds.length; j++) {
                        if (ds[j] == "1") {
                            text += DAYS[j] + " ";
                        }
                    }
                    text += "\n" + frequency[2];
                }
                else {
                    text += "ทุกวันที่ " + frequency[1] + "\n" + frequency[2];
                }

                var param = (r.id + ', ' + r.type + ', \'' + r.title + '\', \'' + r.frequency + '\'');

                $("#pagesix #table-body").append('\
                <tr id="dummy' + i + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><input type="checkbox" onclick="swap(' + r.id + ')" data-enhanced="true" class="custom" ' + (r.state == "1" ? "checked" : "") + '> ' + r.title + '</td>\
                    <td data-colstart="3">' + text + '</td>\
                    <td data-colstart="4" data-priority="1" class="ui-table-priority-4 ui-table-cell-hidden">\
                        <div class="ui-controlgroup-controls ">\
                            <a href="#" onclick="showScheduleEditField(' + param + ');" data-role="button" data-iconpos="notext" data-theme="a" data-inline="true" class="ui-link ui-btn ui-btn-a ui-icon-edit ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" role="button">My button</a>\
                            <a href="#" onclick="removeSchedule(' + r.id + ');" data-role="button" data-iconpos="notext" data-theme="a" data-inline="true" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" role="button">My button</a>\
                        </div>\
                    </td>\
                </tr>');
            }

            if (response.length == 0) {
                $("#pagesix #table-body").append('<tr><td colspan="4" style="text-align: center;">ไม่มีรายการ</td></tr>');
            }

            $('#pagesix #table-column-toggle-pagesix').trigger("create");
            $('#pagesix #table-column-toggle-pagesix').table("refresh");

        }
        else {
            console.log("getting transaction failed");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

function swap(id) {
    console.log(id);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "swap_schedule",
            "id": id
        }
    }).done(function(response) {
        if (response != undefined) {
            getSchedulesTable();
            syncSchedules();
        }
    });
}

function removeSchedule(id) {
    console.log(id);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "remove_schedule",
            "id": id
        }
    }).done(function(response) {
        console.log(response);
        if (response != undefined) {
            getSchedulesTable();
            syncSchedules();
        }
    });
}


