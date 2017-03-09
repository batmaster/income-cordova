$(document).ready(function() {

    $(document).on("pagebeforeshow", "#pagetwo", function() {
        google.charts.load('current', {'packages':['corechart']});
    });

    function getSummary() {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_summary_by_user_id",
                "user_id": localStorage.getItem(KEY_USERID)
            }
        }).done(function(response) {

            $("#pagetwo #amount").text((response.amount == undefined ? 0 : response.amount) + " บาท");

            google.charts.setOnLoadCallback(function() {
                var summary = new google.visualization.DataTable();
                summary.addColumn('string', 'รายการ');
                summary.addColumn('number', 'จำนวน');

                summary.addRows([["รายรับ " + Number(response.income) + " บาท", Number(response.income)], ["รายจ่าย "  + Number(response.outcome) + " บาท", Number(response.outcome)]]);

                var div = $("#pagetwo #summary_div");
                var chartwidth = div.width();

                var option = {'title': "รายรับ-รายจ่าย วันที่ " + response.date_from + " ถึง " + response.date_to, 'width':chartwidth, 'height':200, 'chartArea': {'width': '90%', 'height': '90%'}};

                new google.visualization.PieChart(document.getElementById('summary_div')).draw(summary, option);
            });
        }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(JSON.stringify(jqXHR) + "\n" + textStatus + "\n" + errorThrown);
        });
    }

    $(document).on("pageshow", "#pagetwo", function() {
        getSummary();
    });
});