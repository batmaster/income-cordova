$(document).ready(function() {


    // f 1, f 2
    $(document).on("pagebeforeshow", "#pageeight", function() {
        $("#pageeight #fragment-1 #date-from").datebox('setTheDate', new Date());
        $("#pageeight #fragment-1 #date-to").datebox('setTheDate', new Date());

        $("#pageeight #fragment-2 #month-from").datebox('setTheDate', new Date());
        $("#pageeight #fragment-2 #month-to").datebox('setTheDate', new Date());

        google.charts.load('current', {'packages':['corechart']});
    });
    
    $(document).on("pageshow", "#pageeight", function() {

    });

    $(document).on("focus", "#fragment-1 *", function() {
        $("#pageeight #tab1").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-2 *", function() {
        $("#pageeight #tab2").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-11 *", function() {
        $("#pageeight #tab11").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-12 *", function() {
        $("#pageeight #tab12").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-13 *", function() {
        $("#pageeight #tab13").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-22 *", function() {
        $("#pageeight #tab22").addClass('ui-btn-active');
    });

    $(document).on("focus", "#fragment-23 *", function() {
        $("#pageeight #tab23").addClass('ui-btn-active');
    });


    // f 1
    $(document).on('click','#pageeight #fragment-1 #date-from', function() {
        $("#pageeight #fragment-1 #date-from").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pageeight #fragment-1 #date-from", function() {
        getTransactionsTableForGroup();
        getDailyBarForGroup();
        getDailyPieForGroup();
    });

    $(document).on('click','#pageeight #fragment-1 #date-to', function() {
        $("#pageeight #fragment-1 #date-to").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pageeight #fragment-1 #date-to", function() {
        getTransactionsTableForGroup();
        getDailyBarForGroup();
        getDailyPieForGroup();
    });

    $(document).on('click','#pageeight #fragment-1 #fragment-11 #today', function() {
        $("#pageeight #fragment-1 #date-from").datebox('setTheDate', new Date());
        $("#pageeight #fragment-1 #date-to").datebox('setTheDate', new Date());
    });


    // f 2
    $(document).on('click','#pageeight #fragment-2 #month-from', function() {
        $("#pageeight #fragment-2 #month-from").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pageeight #fragment-2 #month-from", function() {
        getMonthlyBarForGroup();
        getMonthlyPieForGroup();
    });

    $(document).on('click','#pageeight #fragment-2 #month-to', function() {
        $("#pageeight #fragment-2 #month-to").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pageeight #fragment-2 #month-to", function() {
        getMonthlyBarForGroup();
        getMonthlyPieForGroup();
    });

    $("#pageeight #inner-tabs1").on("tabsactivate", function(event, ui) {
        switch ($(this).tabs('option', 'active')) {
            case 1:
                getDailyBarForGroup();
                break;
            case 2:
                getDailyPieForGroup();
                break;
        }
    });

    $("#pageeight #inner-tabs2").on("tabsactivate", function(event, ui) {
        switch ($(this).tabs('option', 'active')) {
            case 0:
                getMonthlyBarForGroup();
                break;
            case 1:
                getMonthlyPieForGroup();
                break;
        }
    });

});

// f 1 1
function getTransactionsTableForGroup() {
    $("#pageeight #fragment-1 #fragment-11 #table-body").empty();

    var df = $("#pageeight #fragment-1 #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pageeight #fragment-1 #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_by_group_id",
            "date_from": date_from,
            "date_to": date_to,
            "group_id": localStorage.getItem(KEY_GROUPID)
        }
    }).done(function(response) {
        $("#pageeight #fragment-1 #fragment-11 #table-body").empty();
        console.log("getting transaction ok " + response);
        if (response != undefined) {
            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                console.log(TYPE[r.type]);
                $("#pageeight #fragment-1 #fragment-11 #table-body").append('\
                <tr>\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2">' + r.title + '</td>\
                    <td data-colstart="3" data-priority="1" class="ui-table-priority-3 ui-table-cell-hidden">' + TYPE[r.type] + '</td>\
                    <td data-colstart="4" style="text-align:right;">' + (r.type == "0" ? "+" : "-") + Number(r.amount).toFixed(2) + '</td>\
                    <td data-colstart="5" data-priority="2" class="ui-table-priority-5 ui-table-cell-hidden">' + r.date + '</td>\
                    <td data-colstart="6" data-priority="3" class="ui-table-priority-6">' + r.name + '</td>\
                </tr>');
            }

            if (response.length == 0) {
                $("#pageeight #fragment-1 #fragment-11 #table-body").append('<tr><td colspan="6" style="text-align: center;">ไม่มีรายการ</td></tr>');
            }

            $('#pageeight #fragment-1 #fragment-11 #table-column-toggle-pageeight').trigger("create");
            $('#pageeight #fragment-1 #fragment-11 #table-column-toggle-pageeight').table("refresh");
        }
        else {
            console.log("getting transaction failed");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

// f 1 2
function getDailyBarForGroup() {
    var df = $("#pageeight #fragment-1 #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pageeight #fragment-1 #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_date_by_group_id",
            "date_from": date_from,
            "date_to": date_to,
            "group_id": localStorage.getItem(KEY_GROUPID)
        }
    }).done(function(response) {
        google.charts.setOnLoadCallback(function() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'วันที่');
            data.addColumn('number', 'รายรับ');
            data.addColumn('number', 'รายจ่าย');

            for (var d = new Date(df.getFullYear(), df.getMonth(), df.getDate()); d <= dt; d.setDate(d.getDate() + 1)) {

                var added = false;
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];

                    var current = new Date(r.date);

                    if ((d.getFullYear() == current.getFullYear()) && (d.getMonth() == current.getMonth()) && (d.getDate() == current.getDate())) {
                        data.addRow([moment(new Date(d.getFullYear(), d.getMonth(), d.getDate())).locale("th").format('DD MMM'), Number(r.income), Number(r.outcome)]);
                        response.splice(i, 1);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    data.addRow([moment(new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))).locale("th").format('DD MMM'), 0, 0]);
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
                minValue: 1,
              },
              explorer: {actions: ['dragToPan', 'rightClickToReset'], axis: 'horizontal'},
              'chartArea': {'width': '80%', 'height': '55%'}
            };

            new google.visualization.ColumnChart(document.getElementById('bar_group_div')).draw(data, options);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

// f 1 3
function getDailyPieForGroup() {
    var df = $("#pageeight #fragment-1 #date-from").datebox('getTheDate');
    var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
    var dt = $("#pageeight #fragment-1 #date-to").datebox('getTheDate');
    var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_title_by_group_id",
            "date_from": date_from,
            "date_to": date_to,
            "group_id": localStorage.getItem(KEY_GROUPID)
        }
    }).done(function(response) {
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

            var incomeOption = {'title':'รายรับ', 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '90%'}};
            var outcomeOption = {'title':'รายจ่าย', 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '90%'}};

            new google.visualization.PieChart(document.getElementById('income_group_div')).draw(income, incomeOption);
            new google.visualization.PieChart(document.getElementById('outcome_group_div')).draw(outcome, outcomeOption);
        });

    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}



// f 2 2
function getMonthlyBarForGroup() {
    var df = $("#pageeight #fragment-2 #month-from").datebox('getTheDate');
    var month_from = TODATE(df.getFullYear(), df.getMonth() + 1, 1);
    var dt = $("#pageeight #fragment-2 #month-to").datebox('getTheDate');
    var last_day = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    var month_to = TODATE(last_day.getFullYear(), last_day.getMonth() + 1, last_day.getDate(), 23, 59, 59);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_month_by_group_id",
            "month_from": month_from,
            "month_to": month_to,
            "group_id": localStorage.getItem(KEY_GROUPID)
        }
    }).done(function(response) {
        google.charts.setOnLoadCallback(function() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', 'เดือน');
            data.addColumn('number', 'รายรับ');
            data.addColumn('number', 'รายจ่าย');

            for (var d = new Date(df.getFullYear(), df.getMonth(), 1); d <= dt; d.setMonth(d.getMonth() + 1)) {

                var added = false;
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];

                    var current = new Date(r.date);

                    if ((d.getFullYear() == current.getFullYear()) && (d.getMonth() == current.getMonth())) {
                        data.addRow([moment(new Date(d.getFullYear(), d.getMonth(), 1)).locale("th").format('MMM YYYY'), Number(r.income), Number(r.outcome)]);
                        response.splice(i, 1);
                        added = true;
                        break;
                    }
                }
                if (!added) {
                    data.addRow([moment(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1))).locale("th").format('MMM YYYY'), 0, 0]);
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
                minValue: 0,
              },
              explorer: {actions: ['dragToPan', 'rightClickToReset'], axis: 'horizontal'},
              'chartArea': {'width': '80%', 'height': '55%'}
            };

            new google.visualization.ColumnChart(document.getElementById('bar_month_group_div')).draw(data, options);
        });
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

// f 2 3
function getMonthlyPieForGroup() {
    var df = $("#pageeight #fragment-2 #month-from").datebox('getTheDate');
    var month_from = TODATE(df.getFullYear(), df.getMonth() + 1, 1);
    var dt = $("#pageeight #fragment-2 #month-to").datebox('getTheDate');
    var last_day = new Date(dt.getFullYear(), dt.getMonth() + 1, 0);
    var month_to = TODATE(last_day.getFullYear(), last_day.getMonth() + 1, last_day.getDate(), 23, 59, 59);

    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_transactions_group_by_month_by_title_by_group_id",
            "month_from": month_from,
            "month_to": month_to,
            "group_id": localStorage.getItem(KEY_GROUPID)
        }
    }).done(function(response) {
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

            var incomeOption = {'title':'รายรับ', 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '90%'}};
            var outcomeOption = {'title':'รายจ่าย', 'width':chartwidth, 'height':300, 'chartArea': {'width': '90%', 'height': '90%'}};

            new google.visualization.PieChart(document.getElementById('income_month_group_div')).draw(income, incomeOption);
            new google.visualization.PieChart(document.getElementById('outcome_month_group_div')).draw(outcome, outcomeOption);
        });

    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}
