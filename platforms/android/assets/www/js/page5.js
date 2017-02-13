$(document).ready(function() {
    $(document).on("pagebeforeshow", "#pagefive", function() {
        $("#pagefive #date-from").datebox('setTheDate', new Date());
        $("#pagefive #date-to").datebox('setTheDate', new Date());
    });

    $(document).on('click','#pagefive #date-from', function() {
        $("#pagefive #date-from").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pagefive #date-from", function() {
        getTransactions();
    });

    $(document).on('click','#pagefive #date-to', function() {
        $("#pagefive #date-to").datebox('setTheDate', new Date());
    });

    $(document).on("change", "#pagefive #date-to", function() {
        getTransactions();
    });

    $(document).on('click','#pagefive #today', function() {
        $("#pagefive #date-from").datebox('setTheDate', new Date());
        $("#pagefive #date-to").datebox('setTheDate', new Date());
    });

    function getTransactions() {
        $("#pagefive #table-body").empty();

        var df = $("#pagefive #date-from").datebox('getTheDate');
        var date_from = TODATE(df.getFullYear(), df.getMonth() + 1, df.getDate());
        var dt = $("#pagefive #date-to").datebox('getTheDate');
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
            $("#pagefive #table-body").empty();
            console.log("getting transaction ok " + response);
            if (response != undefined) {
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    console.log(TYPE[r.type]);
                    $("#pagefive #table-body").append('\
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

                $('#pagefive #table-column-toggle').trigger("create");
                $('#pagefive #table-column-toggle').table("refresh");
            }
            else {
                console.log("getting transaction failed");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });
    }

});
