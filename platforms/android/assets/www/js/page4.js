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

    $(document).on('click','#pagefour #submit', function() {
        var d = $("#pagefour #date").datebox('getTheDate');
        var t = $("#pagefour #time").datebox('getTheDate');
        var date = TODATE(d.getFullYear(), d.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes(), 0);

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
