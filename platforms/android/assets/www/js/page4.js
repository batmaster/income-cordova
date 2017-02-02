$(document).ready(function() {
    /*$(document).on('click','#pagefour #date', function() {
        var d = new Date();
        $("#pagefour #date").datebox({'defaultValue' : [d.getFullYear(), d.getMonth(), d.getDate]});
    });

    $(document).on('click','#pagefour #time', function() {
        var d = new Date();
        $("#pagefour #time").datebox({'setTheDate' : d});
    });*/

    $(document).on("pagebeforeshow", "#pagefour", function() {
        $("#pagefour #type").val(0);
        $("#pagefour #title").val("");
        $("#pagefour #amount").val("");
    });

    $(document).on('click','#pagefour #submit', function() {
        var d = $("#pagefour #date").datebox('getTheDate');
        var t = $("#pagefour #time").datebox('getTheDate');
        var date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + t.getHours() + ":" + t.getMinutes() + ":00";

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
                "date": date
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

});
