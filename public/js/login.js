$(document).ready(function () {

    $('form').submit(function () {
        $.ajax({
            type: 'POST',
            url: '/login',
            data: {
                "name": $('#name').val(),
                "username": $('#username').val()
            },
            dataType: 'json',
            success: function (result) {
                window.location.href = "/chat.html";
            },
            error: function() {
                /* display error */
            }
        });
    });
});
