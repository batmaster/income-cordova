$(document).ready(function() {

    $(document).on("pagebeforeshow", "#pageten", function() {

    });

    $(document).on("pageshow", "#pageten", function() {

        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
            $.mobile.changePage($("#pagetwo"), {transition: "slidedown", changeHash: false});
        }, false);

        getIncomeList();
        getOutcomeList();

    });

    $(document).on('click','#pageten #fragment-income #submit', function() {
        var title = $("#pageten #fragment-income #title").val();

        loading();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "add_list",
                "title": title,
                "type": 0
            }
        }).done(function(response) {
            hideLoading();
            if (response != undefined) {
                toast("เพิ่มรายการเรียบร้อยแล้ว");
                clearFields();
                getIncomeList();
            }
            else {
                console.log("adding transaction failed");
            }
        });
    });

    $(document).on('click','#pageten #fragment-outcome #submit', function() {
        var title = $("#pageten #fragment-outcome #title").val();

        loading();
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "add_list",
                "title": title,
                "type": 1
            }
        }).done(function(response) {
            hideLoading();
            if (response != undefined) {
                toast("เพิ่มรายการเรียบร้อยแล้ว");
                clearFields();
                getOutcomeList();
            }
            else {
                console.log("adding transaction failed");
            }
        });
    });

    function clearFields() {
        $("#pageten #fragment-income #title").val("");
        $("#pageten #fragment-outcome #title").val("");
    }
});

function showEditIncomeFieldPageTen(i) {
    $("#pageten #fragment-income #table-body tr[id^=edit-field]:not(#edit-field" + i + ")").hide(0);
    $("#pageten #fragment-income #table-body #edit-field" + i).show(0);

    $("#pageten #fragment-income #table-body tr[id^=dummy]:not(#dummy" + i + ")").show(0);
    $("#pageten #fragment-income #table-body #dummy" + i).hide(0);
}

function hideAllEditIncomeFieldsPageTen() {
    $("#pageten #fragment-income #table-body tr[id^=dummy]").show(0);
    $("#pageten #fragment-income #table-body tr[id^=edit-field]").hide(0);
}

function saveEditIncomePageTen(i) {
    var id = $("#pageten #fragment-income #table-body #edit-field" + i).data("id");
    var title = $("#pageten #fragment-income #table-body #edit-field" + i + " #title").val();

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "edit_list",
            "id": id,
            "title": title,
        }
    }).done(function(response) {
        hideLoading();
        getIncomeList();

        toast("แก้ไขรายการเรียบร้อยแล้ว");
    });
}

function getIncomeList() {
    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_list_income",
        }
    }).done(function(response) {
        $("#pageten #fragment-income #table-body").empty();
        if (response != undefined) {
            hideLoading();
            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                $("#pageten #fragment-income #table-body").append('\
                <tr id="dummy' + i + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><span id="title">' + r.title + '</span></td>\
                    <td data-colstart="3">\
                        <a href="#" onclick="showEditFieldPageTen(' + i + ');" class="ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="remove(' + r.id + ');" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');

                var date = new Date(r.date);

                $("#pageten #fragment-income #table-body").append('\
                <tr id="edit-field' + i + '" data-id="' + r.id + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><input type="text" id="title" value="' + r.title + '"></td>\
                    <td data-colstart="3">\
                        <a href="#" onclick="hideAllEditIncomeFieldsPageTen();" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="saveEditIncomePageTen(' + i + ');" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');
            }

            if (response.length == 0) {
                $("#pageten #fragment-income #table-body").append('<tr><td colspan="3" style="text-align: center;">ไม่มีรายการ</td></tr>');
            }

            hideAllEditIncomeFieldsPageTen();
        }
        else {
            console.log("getting transaction failed");
        }
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}

function showEditOutcomeFieldPageTen(i) {
    $("#pageten #fragment-outcome #table-body tr[id^=edit-field]:not(#edit-field" + i + ")").hide(0);
    $("#pageten #fragment-outcome #table-body #edit-field" + i).show(0);

    $("#pageten #fragment-outcome #table-body tr[id^=dummy]:not(#dummy" + i + ")").show(0);
    $("#pageten #fragment-outcome #table-body #dummy" + i).hide(0);
}

function hideAllEditOutcomeFieldsPageTen() {
    $("#pageten #fragment-outcome #table-body tr[id^=dummy]").show(0);
    $("#pageten #fragment-outcome #table-body tr[id^=edit-field]").hide(0);
}

function saveEditOutcomePageTen(i) {
    var id = $("#pageten #fragment-outcome #table-body #edit-field" + i).data("id");
    var title = $("#pageten #fragment-outcome #table-body #edit-field" + i + " #title").val();

    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "edit_list",
            "id": id,
            "title": title,
        }
    }).done(function(response) {
        hideLoading();
        getOutcomeList();

        toast("แก้ไขรายการเรียบร้อยแล้ว");
    });
}

function getOutcomeList() {
    loading();
    $.ajax({
        url: SERVER_URL,
        type: "POST",
        dataType: "json",
        data: {
            "function": "get_list_outcome",
        }
    }).done(function(response) {
        $("#pageten #fragment-outcome #table-body").empty();
        if (response != undefined) {
            hideLoading();
            for (var i = 0; i < response.length; i++) {
                var r = response[i];
                $("#pageten #fragment-outcome #table-body").append('\
                <tr id="dummy' + i + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><span id="title">' + r.title + '</span></td>\
                    <td data-colstart="3">\
                        <a href="#" onclick="showEditOutcomeFieldPageTen(' + i + ');" class="ui-btn ui-corner-all ui-icon-edit ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="remove(' + r.id + ');" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');

                var date = new Date(r.date);

                $("#pageten #fragment-outcome #table-body").append('\
                <tr id="edit-field' + i + '" data-id="' + r.id + '">\
                    <th data-colstart="1">' + (i+1) + '</th>\
                    <td data-colstart="2"><input type="text" id="title" value="' + r.title + '"></td>\
                    <td data-colstart="3">\
                        <a href="#" onclick="hideAllEditOutcomeFieldsPageTen();" class="ui-btn ui-corner-all ui-icon-back ui-btn-icon-notext ui-btn-inline">My button</a>\
                        <a href="#" onclick="saveEditOutcomePageTen(' + i + ');" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-notext ui-btn-inline">My button</a>\
                    </td>\
                </tr>');
            }

            if (response.length == 0) {
                $("#pageten #fragment-outcome #table-body").append('<tr><td colspan="3" style="text-align: center;">ไม่มีรายการ</td></tr>');
            }

            hideAllEditOutcomeFieldsPageTen();
        }
        else {
            console.log("getting transaction failed");
        }
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
            "function": "remove_list",
            "id": id
        }
    }).done(function(response) {
        if (response != undefined) {
            hideLoading();
            getIncomeList();
            getOutcomeList();

            toast("ลบรายการเรียบร้อยแล้ว");
        }
    });
}
