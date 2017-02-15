$(document).ready(function() {

    // f 1
    $(document).on("pagebeforeshow", "#pagefive", function() {
        $("#pagefive #fragment-1 #date-from").datebox('setTheDate', new Date());
        $("#pagefive #fragment-1 #date-to").datebox('setTheDate', new Date());

        google.charts.load('current', {'packages':['corechart']});
    });

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

    // f 1 1
    $(document).on('click','#pagefive #fragment-1 #fragment-1 #today', function() {
        $("#pagefive #fragment-1 #date-from").datebox('setTheDate', new Date());
        $("#pagefive #fragment-1 #date-to").datebox('setTheDate', new Date());
    });

    function getTransactionsTable() {
        $("#pagefive #fragment-1 #fragment-1 #table-body").empty();

        var df = $("#pagefive #fragment-1 #date-from").datebox('getTheDate');
        var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
        var dt = $("#pagefive #fragment-1 #date-to").datebox('getTheDate');
        var date_to = TODATE(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), 23, 59, 59);

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
            $("#pagefive #fragment-1 #fragment-1 #table-body").empty();
            if (response != undefined) {
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    console.log(TYPE[r.type]);
                    $("#pagefive #fragment-1 #fragment-1 #table-body").append('\
                    <tr>\
                        <th data-colstart="1">' + (i+1) + '</th>\
                        <td data-colstart="2">' + r.title + '</td>\
                        <td data-colstart="3" data-priority="1" class="ui-table-priority-1 ui-table-cell-hidden">' + TYPE[r.type] + '</td>\
                        <td data-colstart="4" style="text-align:right;">' + (r.type == "0" ? "+" : "-") + Number(r.amount).toFixed(2) + '</td>\
                        <td data-colstart="5" data-priority="2" class="ui-table-priority-2 ui-table-cell-hidden">' + r.date + '</td>\
                        <td data-colstart="6" data-priority="3" class="ui-table-priority-3 ui-table-cell-hidden">\
                            <div class="ui-controlgroup-controls ">\
                                <a href="#" data-role="button" data-icon="edit" data-iconpos="notext" data-theme="a" data-inline="true" class="ui-link ui-btn ui-btn-a ui-icon-edit ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" role="button">My button</a>\
                                <a href="#" data-role="button" data-icon="delete" data-iconpos="notext" data-theme="a" data-inline="true" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" role="button">My button</a>\
                            </div>\
                            <div class="ui-controlgroup-controls ">\
                                <a href="#" data-role="button" data-icon="delete" data-iconpos="notext" data-theme="a" data-inline="true" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" role="button">My button</a>\
                                <a href="#" data-role="button" data-icon="check" data-iconpos="notext" data-theme="a" data-inline="true" class="ui-link ui-btn ui-btn-a ui-icon-check ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all ui-last-child" role="button">My button</a>\
                            </div>\
                        </td>\
                    </tr>');
                }

                $('#pagefive #fragment-1 #fragment-1 #table-column-toggle').trigger("create");
                $('#pagefive #fragment-1 #fragment-1 #table-column-toggle').table("refresh");
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

            console.log("from " + date_from + "   to " + date_to);

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
                console.log(JSON.stringify(response));
                google.charts.setOnLoadCallback(function() {
                    var data = new google.visualization.DataTable();

                    data.addColumn('date', 'วันที่');
//        data.addColumn('string', 'จำนวนรายการ')
                    data.addColumn('number', 'รายรับ');
                    data.addColumn('number', 'รายจ่าย');

//        df.setDate(df.getDate() + 1);
//        dt.setDate(dt.getDate() + 1);
                    console.log("1111")
                    for (var d = df; d <= dt; d.setDate(d.getDate() + 1)) {
                        var added = false;
                        for (var i = 0; i < response.length; i++) {
                            var r = response[i];

                            var current = new Date(r.date);
                            current.setHours(0);
                            console.log(d + " " + current + " " + d.getTime() + " " + current.getTime());

                            if (d.getTime() == current.getTime()) {
                                data.addRow([new Date(d.getTime()), Number(r.income), Number(r.outcome)]);
                                response.splice(i, 1);
                                added = true;
                                break;
                            }
                            console.log("2222")
                        }
                        if (!added) {
                            data.addRow([new Date(d.getTime()), 0, 0]);
                        }
                    }
                    console.log("3333")

                    var div = $("#pagefive #fragment-1 #fragment-2 #bar_div");
                    var chartwidth = div.width();

                    var options = {
                      title: 'กราฟแสดงรายรับ-รายจ่ายรายวัน',
                      width: chartwidth,
                      height: 400,
                      hAxis: {
                        format: 'yyyy-MM-dd',
                        gridlines: {count: 15},
                        slantedText: true,
                        slantedTextAngle: 90,
//                        minValue: new Date("2017-01-01")
                      },
                      vAxis: {
                        gridlines: {color: 'none'},
                        minValue: 0,
                      },
                      bar: {groupWidth: 20},
                      explorer: {actions: ['dragToPan', 'rightClickToReset'], axis: 'horizontal'}
                    };

                    console.log(data);
                    var chart = new google.visualization.ColumnChart(document.getElementById('bar_div'));
                    chart.draw(data, options);
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

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_transactions_by_title_by_user_id",
                "date_from": date_from,
                "date_to": date_to,
                "user_id": localStorage.getItem(KEY_USERID)
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

                var div = $("#pagefive #fragment-1 #fragment-3 #income_div");
                var chartwidth = div.width();

                var incomeOption = {'title':'รายรับ', 'width':chartwidth, 'height':300};
                var outcomeOption = {'title':'รายจ่าย', 'width':chartwidth, 'height':300};

                new google.visualization.PieChart(document.getElementById('income_div')).draw(income, incomeOption);
                new google.visualization.PieChart(document.getElementById('outcome_div')).draw(outcome, outcomeOption);
            });

        }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });
    }

    $(document).on("pageshow", "#pagefive", function() {
        getDailyBar();
        getDailyPie();
    });

});
