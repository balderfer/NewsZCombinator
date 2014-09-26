function uppost(postid) {
    $.ajax({
        type: 'POST',
        data: JSON.stringify({
            id: postid
        }),
        contentType: 'application/json',
        dataType: 'json',
        url: '/uppost/',
        success: function(data) {
            console.log(data.message);
            if (!data.success) {
                alert(data.message);
            }
            getposts();
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function getposts() {
    var count = 1;
    $.getJSON('/getposts/', function(data) {
        $("#posts").html("");

        $.each(data.posts, function(index, post) {
            var oldhtml = $("#posts").html();
            var message = "";
            message += "<tr>";
            message += "<td align='right' valign='top' class='title'>" + count++ + ".</td>";
            message += "<td>";
            message += "<center>";
            message += "<a id='up_8363486' onclick='uppost(&quot;" + post._id + "&quot;)'>";
            message += "<div title='upvote' class='votearrow'></div>";
            message += "</a>";
            message += "<span id='down_8363486'></span>";
            message += "</center>";
            message += "</td>";
            message += "<td class='title'>";
            if (post.url) {
                message += "<a href='http://" + post.url + "'>" + post.title + " </a>";
                message += "<span class='comhead'>(" + post.url + ")</span>";
            }
            else {
                message += "<a href='#''>" + post.title + " </a>";
            }
            message += "</td>";
            message += "</tr>";
            message += "<tr>";
            message += "<td colspan='2'></td>";
            message += "<td class='subtext'>";
            message += "<span id='score_8363486'>" + post.points + " points </span>";
            message += "by ";
            message += "<a class='author'>" + post.author + " </a>";
            message += "<span class=''>" + formatdate(post.date) + "</span>";
            message += "</td>";
            message += "</tr>";
            message += "<tr style='height: 5px;''></tr>";
       
            $("#posts").html(oldhtml + message);
        });


    });
}

function newpost() {
    var title = document.getElementById("title").value;
    var url = document.getElementById("url").value;
    var text = document.getElementById("text").value;

    url = url.replace(/.*?:\/\//g, "");

    $.ajax({
        type: 'POST',
        data: JSON.stringify({
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
                window.location.replace("../");
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function signup() {
    var username = document.getElementById("signupusername").value;
    var password = document.getElementById("signuppassword").value;

    if (username.length > 10) {
        $("#signupusername").css('border', '2px solid red');
        $('#signupusername').parent().children('.warning').html("Username must be 10 characters or less.")
    }
    else {
        $.ajax({
            type: 'POST',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            contentType: 'application/json',
            dataType: 'json',
            url: '/local-reg/',
            success: function(data) {
                console.log(data.message);
                if (!data.success) {
                    alert(data.message);
                }
                else {
                    window.location.replace("../");
                }
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
}






jQuery(document).ready(function($) {
    getposts();

    // window.setInterval(function() {
    //     getposts();
    // }, 1000);

    $("#signupusername").keyup(function(event) {
        var value = $(this).val();
        $(this).val(value.replace(/[^a-z0-9]/gmi, "").replace(/\s+/g, ""));
    });

    $("#title, #text").keyup(function(event) {
        var value = $(this).val();
        // TODO add input sanitization for posts 
    });

    $(".author").each(function(index, el) {
        if ($(this).html().length > 10) {
            var trimmedString = $(this).html().substring(0, 10) + "...";
            $(this).html(trimmedString);
        }
    });
    

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

function formatdate(d) {
    var currentDate = new Date();
    var date = new Date(d);
    var diffYear = currentDate.getYear() - date.getYear();
    if (diffYear !== 0) {
        return diffYear + " years ago";
    }
    else {
        var diffMonth = currentDate.getMonth() - date.getMonth();
        if (diffMonth !== 0) {
            return diffMonth + " months ago";
        }
        else {
            var diffDay = currentDate.getDate() - date.getDate();
            if (diffDay !== 0) {
                return diffDay + " days ago";
            }
            else {
                var diffHour = currentDate.getHours() - date.getHours();
                if (diffHour !== 0) {
                    return diffHour + " hours ago";
                }
                else {
                    var diffMin = currentDate.getMinutes() - date.getMinutes();
                    return diffMin + " minutes ago";
                }
            }
        }
    }
}