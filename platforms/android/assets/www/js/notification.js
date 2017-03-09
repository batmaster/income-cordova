//$(document).ready(function() {
//    cordova.plugins.notification.local.hasPermission(function (granted) {
//         console.log('Permission has been granted: ' + granted);
//    });
//});

document.addEventListener('deviceready', function () {

    cordova.plugins.notification.local.hasPermission(function (granted) {
         console.log('Permission has been granted: ' + granted);
    });

    cordova.plugins.notification.local.registerPermission(function (granted) {
         console.log('Permission has been granted: ' + granted);
    });

//    cordova.plugins.notification.local.schedule({
//        id         : 14421,
//      title      : 'I will bother you every minute',
//      text       : '.. until you cancel all notifications',
//        every: 1 // every 30 minutes
//    });

    cordova.plugins.notification.local.on("click", function (notification, state) {
        alert(notification.id + " was clicked");
    }, this);

    syncSchedules();


}, false);

function syncSchedules() {
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_schedules",
            "user_id": localStorage.getItem(KEY_USERID)
        }
    }).done(function(response) {
        if (response != undefined) {
            clearSchedules();

            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                if (r["state"] == "0") {
                    continue;
                }

                var id = 1000 + Number(r["id"]);
                var title = r["title"];
                var frequency = r["frequency"].split(" ");

                var text = "";

                console.log((frequency[0] == "0") + " " + frequency[0])

                if (frequency[0] == "0") {
                    var schedules = [];

                    text += "ทุกวัน ";

                    var ds = frequency[1];
                    for (var j = 0; j < ds.length; j++) {
                        if (ds[j] == "1") {
                            text += DAYS[j] + " ";
                        }
                    }
                    text += frequency[2];

                    for (var j = 0; j < ds.length; j++) {
                        if (ds[j] == "1") {
                            var n = new Date();
                            var d = moment().isoWeekday(j).toDate();
                            d.setHours(Number(frequency[2].split(":")[0]));
                            d.setMinutes(Number(frequency[2].split(":")[1]));
                            d.setSeconds(0);

                            if (d.getTime() <= n.getTime()) {
                                d = moment().add(1, 'weeks').isoWeekday(j).toDate();
                                d.setHours(Number(frequency[2].split(":")[0]));
                                d.setMinutes(Number(frequency[2].split(":")[1]));
                                d.setSeconds(0);
                            }

                            var idn = String(id) + j;
                            schedules.push({
                                id : idn,
                                title : title,
                                text: text,
                                at: d,
                                every: 'week'
                            });
                        }
                    }

                    addSchedules(schedules);
                }
                else {
                    text += "ทุกวันที่ " + frequency[1] + " " + frequency[2];

                    var n = new Date();
                    var d = moment().toDate();
                    d.setHours(Number(frequency[2].split(":")[0]));
                    d.setMinutes(Number(frequency[2].split(":")[1]));
                    d.setSeconds(0);

                    if (d.getTime() <= n.getTime()) {
                        d = moment().add(1, 'months').toDate();
                        d.setHours(Number(frequency[2].split(":")[0]));
                        d.setMinutes(Number(frequency[2].split(":")[1]));
                        d.setSeconds(0);
                    }

                    addSchedules({
                        id : id,
                        title : title,
                        text: text,
                        at: d,
                        every: 'month'
                    });
                }
            }

        }
    });

    printLocalSchedules();
}

function printLocalSchedules() {
    cordova.plugins.notification.local.getScheduledIds(function (scheduledIds) {
        for (var i = 0; i < scheduledIds.length; i++) {
            cordova.plugins.notification.local.getScheduled(scheduledIds[i], function (scheduled) {
                console.log(JSON.stringify(scheduled));
            });
        }
    });
}

function addSchedules(schedules) {
    cordova.plugins.notification.local.schedule(schedules, function(res) {

    }, this);
}

function clearSchedules() {
    cordova.plugins.notification.local.cancelAll(function() {

    }, this);
}
