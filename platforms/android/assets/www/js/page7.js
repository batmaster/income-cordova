$(document).ready(function() {

    $(document).on("pageshow", "#pageseven", function() {
        getGroupDetail();
        getMembers();
    });

    function getGroupDetail() {
        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_group_detail_by_head_user_id",
                "user_id": localStorage.getItem(KEY_USERID)
            }
        }).done(function(response) {
            if (response != undefined) {
                $("#pageseven #title").text(response.title);
                $("#pageseven #code").text(response.code);
                if (response.pending > 0) {
                    $("#pageseven #badge").text(response.pending + " รออนุมัติ");
                    $("#pageseven #badge").show("slow");
                }
            }
            else {
                console.log("getting transaction failed");
            }
        });
    }

    function getMembers() {
        $("#pageseven #table-body").empty();

        $.ajax({
            url: SERVER_URL,
            type: "POST",
            dataType: "json",
            data: {
                "function": "get_members_by_head_user_id",
                "user_id": localStorage.getItem(KEY_USERID)
            }
        }).done(function(response) {
            $("#pageseven #table-body").empty();
            if (response != undefined) {
                for (var i = 0; i < response.length; i++) {
                    var r = response[i];
                    $("#pageseven #table-body").append('\
                    <tr>\
                        <th data-colstart="1">' + (i+1) + '</th>\
                        <td data-colstart="2">' + r.name + '</td>\
                        <td data-colstart="3" data-priority="1" class="ui-table-priority-1 ui-table-cell-hidden">' + r.email + '</td>\
                        <td data-colstart="4">' + r.phone + '</td>\
                        <td data-colstart="5" data-priority="2" class="ui-table-priority-2 ui-table-cell-hidden"><input type="button" value="อนุมัติ" ' + (Number(r.group_id) > 0 ? 'disabled' : '') + ' onclick="approve(' + r.id + ', this);"></td>\
                    </tr>');
                }
                $('#pageseven #table-column-toggle').trigger("create");
                $('#pageseven #table-column-toggle').table("refresh");
            }
            else {
                console.log("getting transaction failed");
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
        });
    }



    $("#pageseven #badge").hide(0);
});

function approve(user_id, src) {
    $(src).button({
      disabled: true
    });

    $.ajax({
        url: SERVER_URL,
        type: "POST",
//        dataType: "json",
        data: {
            "function": "approve_member",
            "user_id": user_id
        }
    }).done(function(response) {
        console.log("approve ok" + response);
    }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR + "\n" + textStatus + "\n" + errorThrown);
    });
}
