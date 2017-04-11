$(document).ready(function() {

    // f 1, f 2
    $(document).on("pagebeforeshow", "#pagefive", function() {
        $("#pagefive #fragment-1 #date-from").datebox('setTheDate', new Date());
        $("#pagefive #fragment-1 #date-to").datebox('setTheDate', new Date());

        $("#pagefive #fragment-2 #month-from").datebox('setTheDate', new Date());
        $("#pagefive #fragment-2 #month-to").datebox('setTheDate', new Date());

        google.charts.load('current', {'packages':['corechart']});
    });

    $(document).on("pageshow", "#pagefive", function() {

        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
            $.mobile.changePage($("#pagetwo"), {transition: "slidedown", changeHash: false});
        }, false);

    });

    $(document).on("focus", "#fragment-1 *", function() {
        $("#pagefive #tab1").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-2 *", function() {
        $("#pagefive #tab2").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-11 *", function() {
        $("#pagefive #tab11").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-12 *", function() {
        $("#pagefive #tab12").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-13 *", function() {
        $("#pagefive #tab13").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-22 *", function() {
        $("#pagefive #tab22").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-23 *", function() {
        $("#pagefive #tab23").addClass('ui-btn-active');
    });


    // f 1
    $(document).on('click','#pagefive #fragment-1 #date-from', function() {
        $("#pagefive #fragment-1 #date-from").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pagefive #fragment-1 #date-from", function() {
        getTransactionsTable();
        getDailyBar();
        getDailyPie();
    });

    $(document).on('click','#pagefive #fragment-1 #date-to', function() {
        $("#pagefive #fragment-1 #date-to").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pagefive #fragment-1 #date-to", function() {
        getTransactionsTable();
        getDailyBar();
        getDailyPie();
    });

    $(document).on('click','#pagefive #fragment-1 #fragment-11 #today', function() {
        $("#pagefive #fragment-1 #date-from").datebox('setTheDate', new Date());
        $("#pagefive #fragment-1 #date-to").datebox('setTheDate', new Date());
    });


    // f 2
    $(document).on('click','#pagefive #fragment-2 #month-from', function() {
        $("#pagefive #fragment-2 #month-from").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pagefive #fragment-2 #month-from", function() {
        getMonthlyBar();
        getMonthlyPie();
    });

    $(document).on('click','#pagefive #fragment-2 #month-to', function() {
        $("#pagefive #fragment-2 #month-to").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pagefive #fragment-2 #month-to", function() {
        getMonthlyBar();
        getMonthlyPie();
    });

    $("#pagefive #inner-tabs1").on("tabsactivate", function(event, ui) {
        switch ($(this).tabs('option', 'active')) {
            case 1:
                getDailyBar();
                break;
            case 2:
                getDailyPie();
                break;
        }
    });

    $("#pagefive #inner-tabs2").on("tabsactivate", function(event, ui) {
        switch ($(this).tabs('option', 'active')) {
            case 0:
                getMonthlyBar();
                break;
            case 1:
                getMonthlyPie();
                break;
        }
    });


});

function showEditField(i) {
    $("#pagefive #fragment-1 #fragment-11 #table-body tr[id^=edit-field]:not(#edit-field" + i + ")").hide(0);
    $("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i).show(0);

    $("#pagefive #fragment-1 #fragment-11 #table-body tr[id^=dummy]:not(#dummy" + i + ")").show(0);
    $("#pagefive #fragment-1 #fragment-11 #table-body #dummy" + i).hide(0);
}

function hideAllEditFields() {
  console.log("hideAllEditFields");
    $("#pagefive #fragment-1 #fragment-11 #table-body tr[id^=dummy]").show(0);
    $("#pagefive #fragment-1 #fragment-11 #table-body tr[id^=edit-field]").hide(0);
}

function saveEdit(i) {
    var id = $("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i).data("id");
    var title = $("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i + " #title").val();
    var type = $("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i + " #type").val();
    var amount = Math.abs($("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i + " #amount").val());


    var d = $("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i + " #date").datebox('getTheDate');
    var t = $("#pagefive #fragment-1 #fragment-11 #table-body #edit-field" + i + " #time").datebox('getTheDate');
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
        getTransactionsTable();
        getDailyBar();
        getDailyPie();

        toast("แก้ไขรายการเรียบร้อยแล้ว");
    });
}

// f 1 1
function getTransactionsTable() {
    $("#pagefive #fragment-1 #fragment-11 #table-body").empty();

    var df = $("#pagefive #fragment-1 #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pagefive #fragment-1 #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_by_user_id",
            "date_from": date_from,
            "date_to": date_to,
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {

        $("#pagefive #fragment-1 #fragment-11 #table-body").empty();
        if (response != undefined) {
            hideLoading();
            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                $("#pagefive #fragment-1 #fragment-11 #table-body").append('\
                <tr id="dummy' + i + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><span id="title">' + r.title + '</span></td>\
                    <td data-colstart="3" data-priority="1" class="ui-table-priority-3 ui-table-cell-hidden">' + TYPE[r.type] + '</td>\
                    <td data-colstart="4" style="text-align: right;">' + (r.type == "0" ? "+" : "-") + Number(r.amount).toFixed(2) + '</td>\
                    <td data-colstart="5" data-priority="2" class="ui-table-priority-5 ui-table-cell-hidden">' + r.date.substring(0, 16) + '</td>\
                    <td data-colstart="6" data-priority="3" class="ui-table-priority-6 ui-table-cell-hidden">\
                        <a href="#" onclick="showEditField(' + i + ');" class="ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="remove(' + r.id + ');" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');

                var date = new Date(r.date);

                $("#pagefive #fragment-1 #fragment-11 #table-body").append('\
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
                    <td data-colstart="6" data-priority="6" class="ui-table-priority-6 ui-table-cell-hidden">\
                        <a href="#" onclick="hideAllEditFields();" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="saveEdit(' + i + ');" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');
            }

            if (response.length == 0) {
                $("#pagefive #fragment-1 #fragment-11 #table-body").append('<tr><td colspan="6" style="text-align: center;">ไม่มีรายการ</td></tr>');
            }

            $('#pagefive #fragment-1 #fragment-11 #table-column-toggle-pagefive').trigger("create");
            $('#pagefive #fragment-1 #fragment-11 #table-column-toggle-pagefive').table("refresh");

//            $("#pagefive #fragment-1 #fragment-11 #table-body #type").selectmenu().selectmenu("refresh");

            hideAllEditFields();
        }
        else {
            console.log("getting transaction failed");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

// f 1 2
function getDailyBar() {
    var df = $("#pagefive #fragment-1 #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pagefive #fragment-1 #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_date_by_user_id",
            "date_from": date_from,
            "date_to": date_to,
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {
        hideLoading();
        google.charts.setOnLoadCallback(function() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'วันที่');
            data.addColumn('number', 'คงเหลือ');
            data.addColumn('number', 'รายรับ');
            data.addColumn('number', 'รายจ่าย');

            for (var d = new Date(df.getFullYear(), df.getMonth(), df.getDate()); d <= dt; d.setDate(d.getDate() + 1)) {

                var added = false;
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];

                    var current = new Date(r.date);

                    if ((d.getFullYear() == current.getFullYear()) && (d.getMonth() == current.getMonth()) && (d.getDate() == current.getDate())) {
                        data.addRow([moment(new Date(d.getFullYear(), d.getMonth(), d.getDate())).locale("th").format('D MMM'), Number(r.balance), Number(r.income), Number(r.outcome)]);
                        response.splice(i, 1);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    data.addRow([moment(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))).locale("th").format('D MMM'), 0, 0, 0]);
                }
            }

            var div = $("#pagetwo #summary_div");
            var chartwidth = div.width();

            var options = {
              title: 'กราฟแสดงรายรับ-รายจ่ายรายวัน',
              width: chartwidth,
              height: 400,
              hAxis: {
                gridlines: {count: 15},
                slantedText: true,
                slantedTextAngle: 90,
              },
              vAxis: {
                gridlines: {color: 'none'},
                minValue: 0,
              },
              bar: {
                groupWidth: 40
              },
              explorer: {
                axis: 'horizontal',
                keepInBounds: false
              },
              chartArea: {
                left: '12%',
                right: '25%',
                width: '63%',
                height: '65%'
              },
              colors: ['#DF9C3D', '#4C6EC5', '#B45133']
            };

            new google.visualization.ColumnChart(document.getElementById('bar_div')).draw(data, options);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

// f 1 3
function getDailyPie() {
    var df = $("#pagefive #fragment-1 #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pagefive #fragment-1 #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_title_by_user_id",
            "date_from": date_from,
            "date_to": date_to,
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {
        hideLoading();
        google.charts.setOnLoadCallback(function() {
            var income = new google.visualization.DataTable();
            income.addColumn('string', 'รายการ');
            income.addColumn('number', 'จำนวน');

            var outcome = new google.visualization.DataTable();
            outcome.addColumn('string', 'รายการ');
            outcome.addColumn('number', 'จำนวน');

            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                if (r.type == "0") {
                    income.addRow([r.title + " (" + r.count + ")", Number(r.amount)]);
                }
                else {
                    outcome.addRow([r.title + " (" + r.count + ")", Number(r.amount)]);
                }
            }

            var div = $("#pagetwo #summary_div");
            var chartwidth = div.width();

            var incomeOption = {'title':'รายรับ ' + date_from.split(" ")[0] + " - " + date_to.split(" ")[0], 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '85%'}};
            var outcomeOption = {'title':'รายจ่าย ' + date_from.split(" ")[0] + " - " + date_to.split(" ")[0], 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '85%'}};

            new google.visualization.PieChart(document.getElementById('income_div')).draw(income, incomeOption);
            new google.visualization.PieChart(document.getElementById('outcome_div')).draw(outcome, outcomeOption);
        });

    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}



// f 2 2
function getMonthlyBar() {
    var df = $("#pagefive #fragment-2 #month-from").datebox('getTheDate');
    var month_from = TODATE(df.getFullYear(), df.getMonth() + 1, 1);
    var dt = $("#pagefive #fragment-2 #month-to").datebox('getTheDate');
    var last_day = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    var month_to = TODATE(last_day.getFullYear(), last_day.getMonth() + 1, last_day.getDate(), 23, 59, 59);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_month_by_user_id",
            "month_from": month_from,
            "month_to": month_to,
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {
        hideLoading();
        google.charts.setOnLoadCallback(function() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'เดือน');
            data.addColumn('number', 'คงเหลือ');
            data.addColumn('number', 'รายรับ');
            data.addColumn('number', 'รายจ่าย');

            for (var d = new Date(df.getFullYear(), df.getMonth(), 1); d <= dt; d.setMonth(d.getMonth() + 1)) {

                var added = false;
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];

                    var current = new Date(r.date);

                    if ((d.getFullYear() == current.getFullYear()) && (d.getMonth() == current.getMonth())) {
                        data.addRow([moment(new Date(d.getFullYear(), d.getMonth(), 1)).locale("th").format('MMM YYYY'), Number(r.balance), Number(r.income), Number(r.outcome)]);
                        response.splice(i, 1);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    data.addRow([moment(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1))).locale("th").format('MMM YYYY'), 0, 0, 0]);
                }
            }

            var div = $("#pagetwo #summary_div");
            var chartwidth = div.width();

            var options = {
              title: 'กราฟแสดงรายรับ-รายจ่ายรายเดือน',
              width: chartwidth,
              height: 400,
              hAxis: {
                gridlines: {count: 15},
                slantedText: true,
                slantedTextAngle: 90,
              },
              vAxis: {
                gridlines: {color: 'none'},
                minValue: 1,
              },
              bar: {
                groupWidth: 40
              },
              explorer: {
                axis: 'horizontal',
                keepInBounds: false
              },
              chartArea: {
                left: '12%',
                right: '25%',
                width: '63%',
                height: '65%'
                },
              colors: ['#DF9C3D', '#4C6EC5', '#B45133']
            };

            new google.visualization.ColumnChart(document.getElementById('bar_month_div')).draw(data, options);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

// f 2 3
function getMonthlyPie() {
    var df = $("#pagefive #fragment-2 #month-from").datebox('getTheDate');
    var month_from = TODATE(df.getFullYear(), df.getMonth() + 1, 1);
    var dt = $("#pagefive #fragment-2 #month-to").datebox('getTheDate');
    var last_day = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    var month_to = TODATE(last_day.getFullYear(), last_day.getMonth() + 1, last_day.getDate(), 23, 59, 59);

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_month_by_title_by_user_id",
            "month_from": month_from,
            "month_to": month_to,
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {
        hideLoading();
        google.charts.setOnLoadCallback(function() {
            var income = new google.visualization.DataTable();
            income.addColumn('string', 'รายการ');
            income.addColumn('number', 'จำนวน');

            var outcome = new google.visualization.DataTable();
            outcome.addColumn('string', 'รายการ');
            outcome.addColumn('number', 'จำนวน');

            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                if (r.type == "0") {
                    income.addRow([r.title + " (" + r.count + ")", Number(r.amount)]);
                }
                else {
                    outcome.addRow([r.title + " (" + r.count + ")", Number(r.amount)]);
                }
            }

            var div = $("#pagetwo #summary_div");
            var chartwidth = div.width();

            var incomeOption = {'title':'รายรับ ' + month_from.substring(0, 10) + " - " + month_to.substring(0, 10), 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '90%'}};
            var outcomeOption = {'title':'รายจ่าย ' + month_from.substring(0, 10) + " - " + month_to.substring(0, 10), 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '90%'}};

            new google.visualization.PieChart(document.getElementById('income_month_div')).draw(income, incomeOption);
            new google.visualization.PieChart(document.getElementById('outcome_month_div')).draw(outcome, outcomeOption);
        });

    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

function remove(id) {
    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "remove_transaction",
            "id": id
        }
    }).done(function(response) {
        if (response != undefined) {
            hideLoading();
            getTransactionsTable();
            getDailyBar();
            getDailyPie();

            toast("ลบรายการเรียบร้อยแล้ว");
        }
    });
}
