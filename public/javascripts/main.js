// function upmykarma(id) {
//     $.ajax({
//         type: 'POST',
//         data: JSON.stringify({
//             id: id
//         }),
//         contentType: 'application/json',
//         dataType: 'json',
//         url: '/upmykarma/',
//         success: function(data) {
//             console.log(data.message);
//             if (!data.success) {
//                 alert(data.message);
//             }
//             location.reload();
//         },
//         error: function(data) {
//             console.log(data);
//         }
//     });
// }

function uppost(postid, id) {
    if (id == '') {
        console.log("lel");
        location.href = "/signin";
    }
    else {
        $.ajax({
            type: 'POST',
            data: JSON.stringify({
                id: postid,
                userid: id
            }),
            contentType: 'application/json',
            dataType: 'json',
            url: '/uppost/',
            success: function(data) {
                console.log(data.message);
                if (!data.success) {
                    alert(data.message);
                }
                window.setTimeout(function() {
                    location.reload();
                }, 500);
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
}

function newpost(id) {
    var title = document.getElementById("title").value;
    var url = document.getElementById("url").value;
    var text = document.getElementById("text").value;

    url = url.replace(/.*?:\/\//g, "");

    console.log(url);

    $.ajax({
        type: 'POST',
        data: JSON.stringify({
            id: id,
            title: title,
            url: url,
            text: text
        }),
        contentType: 'application/json',
        dataType: 'json',
        url: '/newpost/',
        success: function(data) {
            console.log(data.message);
            if (!data.success) {
                alert(data.message);
            }
            else {
                window.location.replace("http://news.zcombinator.me");
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}



jQuery(document).ready(function($) {
    

    // Format time
    $(".formatdate").each(function(index, el) {
        var currentDate = new Date();
        var date = new Date($(this).html());
        // console.log(date + ", " + currentDate);
        var diffYear = currentDate.getYear() - date.getYear();
        if (diffYear !== 0) {
            console.log(diffYear);
            $(this).html(diffYear + " years ago");
        }
        else {
            var diffMonth = currentDate.getMonth() - date.getMonth();
            if (diffMonth !== 0) {
                console.log(diffMonth);
                $(this).html(diffMonth + " months ago");
            }
            else {
                var diffDay = currentDate.getDate() - date.getDate();
                if (diffDay !== 0) {
                    console.log(diffDay);
                    $(this).html(diffDay + " days ago");
                }
                else {
                    var diffHour = currentDate.getHours() - date.getHours();
                    if (diffHour !== 0) {
                        console.log(diffHour);
                        $(this).html(diffHour + " hours ago");
                    }
                    else {
                        var diffMin = currentDate.getMinutes() - date.getMinutes();
                        console.log(diffMin);
                        $(this).html(diffMin + " minutes ago");
                    }
                }
            }
        }
    });


});