$(document).ready(function() {

    $(document).on("pagebeforeshow", "#pageten", function() {
        $("#pageten #date-from").datebox('setTheDate', new Date());
        $("#pageten #date-to").datebox('setTheDate', new Date());
    });

    $(document).on("pageshow", "#pageten", function() {

        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
            $.mobile.changePage($("#pagetwo"), {transition: "slidedown", changeHash: false});
        }, false);

    });

    // f 1
    $(document).on('click','#pageten #date-from', function() {
        $("#pageten #date-from").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pageten #date-from", function() {
        getTransactionsTablePageTen();
    });

    $(document).on('click','#pageten #date-to', function() {
        $("#pageten #date-to").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pageten #date-to", function() {
        getTransactionsTablePageTen();
    });

    $(document).on('click','#pageten #today', function() {
        $("#pageten #date-from").datebox('setTheDate', new Date());
        $("#pageten #date-to").datebox('setTheDate', new Date());
    });


});

function showEditFieldPageTen(i) {
    $("#pageten #table-body tr[id^=edit-field]:not(#edit-field" + i + ")").hide(0);
    $("#pageten #table-body #edit-field" + i).show(0);

    $("#pageten #table-body tr[id^=dummy]:not(#dummy" + i + ")").show(0);
    $("#pageten #table-body #dummy" + i).hide(0);
}

function hideAllEditFieldsPageTen() {
    $("#pageten #table-body tr[id^=dummy]").show(0);
    $("#pageten #table-body tr[id^=edit-field]").hide(0);
}

function saveEditPageTen(i) {
    var id = $("#pageten #table-body #edit-field" + i).data("id");
    var title = $("#pageten #table-body #edit-field" + i + " #title").val();
    var type = $("#pageten #table-body #edit-field" + i + " #type").val();
    var amount = Math.abs($("#pageten #table-body #edit-field" + i + " #amount").val());


    var d = $("#pageten #table-body #edit-field" + i + " #date").datebox('getTheDate');
    var t = $("#pageten #table-body #edit-field" + i + " #time").datebox('getTheDate');
    var date = TODATE(d.getFullYear(), d.getMonth() + 1, d.getDate(), t.getHours(), t.getMinutes(), 0);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "edit_transaction",
            "id": id,
            "title": title,
            "type": type,
            "amount": amount,
            "date": date
        }
    }).done(function(response) {
        hideLoading();
        getTransactionsTablePageTen();

        toast("แก้ไขรายการเรียบร้อยแล้ว");
    });
}

function getTransactionsTablePageTen() {
    $("#pageten #table-body").empty();

    var df = $("#pageten #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pageten #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions",
            "date_from": date_from,
            "date_to": date_to,
        }
    }).done(function(response) {
        $("#pageten #table-body").empty();
        if (response != undefined) {
            hideLoading();
            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                $("#pageten #table-body").append('\
                <tr id="dummy' + i + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><span id="title">' + r.title + '</span></td>\
                    <td data-colstart="3" data-priority="1" class="ui-table-priority-3 ui-table-cell-hidden">' + TYPE[r.type] + '</td>\
                    <td data-colstart="4" style="text-align: right;">' + (r.type == "0" ? "+" : "-") + Number(r.amount).toFixed(2) + '</td>\
                    <td data-colstart="5" data-priority="2" class="ui-table-priority-5 ui-table-cell-hidden">' + r.date.substring(0, 16) + '</td>\
                    <td data-colstart="6" data-priority="3" class="ui-table-priority-6">' + r.name + '</td>\
                    <td data-colstart="7" data-priority="4" class="ui-table-priority-7 ui-table-cell-hidden">\
                        <a href="#" onclick="showEditFieldPageTen(' + i + ');" class="ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="remove(' + r.id + ');" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');

                var date = new Date(r.date);

                $("#pageten #table-body").append('\
                <tr id="edit-field' + i + '" data-id="' + r.id + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><input type="text" id="title" value="' + r.title + '"></td>\
                    <td data-colstart="3" data-priority="1" class="ui-table-priority-3 ui-table-cell-hidden">\
                        <select id="type">\
                            <option value="0" ' + (r.type == '0' ? "selected" : "") + '>รายรับ</option>\
                            <option value="1" ' + (r.type == '1' ? "selected" : "") + '>รายจ่าย</option>\
                        </select>\
                    </td>\
                    <td data-colstart="4" style="text-align: right;"><input type="number" id="amount" value="' + Number(r.amount) + '"></td>\
                    <td data-colstart="5" data-priority="2" class="ui-table-priority-5 ui-table-cell-hidden">\
                        <input type="text" id="date" data-role="datebox" value="' + r.date.substring(0, 10) + '" data-options=\'{"mode":"calbox", "calUsePickers": "true", "defaultValue": "' + r.date.substring(0, 10) + '"}\' />\
                        <input type="text" id="time" data-role="datebox" value="' + r.date.substring(11, 16) + '" data-options=\'{"mode":"timebox", "useNewStyle":true, "overrideTimeFormat": 24, "themeButton": "a", "themeInput": "a", "theme": "a", "themeHeader": "b", "overrideSetTimeButtonLabel": "ตั้งเวลา", "defaultValue": "' + r.date.substring(11, 16) + '"}\' />\
                    </td>\
                    <td data-colstart="6" data-priority="3" class="ui-table-priority-6">' + r.name + '</td>\
                    <td data-colstart="7" data-priority="4" class="ui-table-priority-7 ui-table-cell-hidden">\
                        <a href="#" onclick="hideAllEditFieldsPageTen();" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="saveEditPageTen(' + i + ');" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');
            }

            if (response.length == 0) {
                $("#pageten #table-body").append('<tr><td colspan="7" style="text-align: center;">ไม่มีรายการ</td></tr>');
            }

            $('#pageten #table-column-toggle-pageten').trigger("create");
            $('#pageten #table-column-toggle-pageten').table("refresh");

//            $("#pageten #table-body #type").selectmenu().selectmenu("refresh");

            hideAllEditFieldsPageTen();
        }
        else {
            console.log("getting transaction failed");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}
